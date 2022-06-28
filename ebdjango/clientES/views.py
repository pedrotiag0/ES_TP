import json
import re

import boto3
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view

# Francisco
GET_MENU_LIST_ARN = 'arn:aws:states:us-east-1:931526129272:stateMachine:getMenuItems'
GET_ORDER_PRICE_ARN = 'arn:aws:states:us-east-1:931526129272:stateMachine:calculatePrice'
GET_FACE_BY_PIC_ARN = 'arn:aws:states:us-east-1:931526129272:stateMachine:validateFace'
REGISTER_ORDER_ARN = 'arn:aws:states:us-east-1:931526129272:stateMachine:processClientOrder'
MARK_AS_DELIVERED_ARN = 'arn:aws:states:us-east-1:931526129272:stateMachine:receiveClientOrder'
S3_BUCKET = 'faces-es'
# Pedro
#GET_MENU_LIST_ARN = 'arn:aws:states:us-east-1:682866775210:stateMachine:getMenuItems'
#GET_ORDER_PRICE_ARN = 'arn:aws:states:us-east-1:682866775210:stateMachine:calculatePrice'
#GET_FACE_BY_PIC_ARN = 'arn:aws:states:us-east-1:682866775210:stateMachine:validateFace'
#REGISTER_ORDER_ARN = 'arn:aws:states:us-east-1:682866775210:stateMachine:processClientOrder'
#MARK_AS_DELIVERED_ARN = 'arn:aws:states:us-east-1:682866775210:stateMachine:receiveClientOrder'
#S3_BUCKET = 'esfaces'


@api_view(['GET', 'POST', 'PUT'])
def mainMenu(request):
    if request.method == 'POST':
        sfn = boto3.client('stepfunctions', region_name='us-east-1')
        response = sfn.start_sync_execution(
            stateMachineArn=GET_MENU_LIST_ARN, name='getMenuItems', input='{}')
        data = json.loads(response['output'])
        data2 = data['Items']
        menu = dict()
        for i in data2:
            menu.update(
                {i['Item_Name']['S']: [i['price']['S'], i['type']['S']]})
        return JsonResponse(menu)
    if request.method == 'PUT':
        print(request.data)
        inputSfn = json.dumps(
            {"locationTag":  request.data["locationTagNumber"], "name": request.data["name"]})
        sfn = boto3.client('stepfunctions', region_name='us-east-1')
        responseDelivered = sfn.start_sync_execution(
            stateMachineArn=MARK_AS_DELIVERED_ARN, name='receiveClientOrder', input=inputSfn)    # Calculate price
        return JsonResponse({"msg": "Success", "orderStatus": json.loads(responseDelivered['output'])['msg']})
    else:
        return render(request, "mainMenu.html", {})


@api_view(['GET', 'POST'])
def checkup(request):
    if request.method == 'POST':
        try:
            inputSFN = request.data['itemsOrder']
            sfn = boto3.client('stepfunctions', region_name='us-east-1')
            responseOrderPrice = sfn.start_sync_execution(
                stateMachineArn=GET_ORDER_PRICE_ARN, name='getMenuItems', input=json.dumps(inputSFN))    # Calculate price
            price = json.loads(responseOrderPrice['output'])['body']
            return JsonResponse({"msg": "Success", "price": price})
        except:
            return JsonResponse({"msg": "Error"})
    else:
        return render(request, "mainMenu.html", {})


@api_view(['GET', 'POST', 'PUT'])
def checkout(request):
    if request.method == 'POST':
        try:
            # Treat data
            picture = request.data.dict()

            # Save foto in S3
            s3 = boto3.resource('s3')
            object = s3.Object(S3_BUCKET, picture['image'].name)
            ret = object.put(Body=picture['image'])

            # Use Rekognition
            sfn = boto3.client('stepfunctions', region_name='us-east-1')
            responseCustomerName = sfn.start_sync_execution(
                stateMachineArn=GET_FACE_BY_PIC_ARN, name='validateFace', input=json.dumps({"name": picture['image'].name}))    # Get name of customer

            if(json.loads(responseCustomerName['output'])['statusCode'] == 200):
                # Found client
                customerName = json.loads(
                    responseCustomerName['output'])['success']
                return JsonResponse({"msg": "Success", "name": customerName})
            else:
                return JsonResponse({"msg": "Error! Please go to the customer support!"})
        except:
            return JsonResponse({"msg": "Error! Please go to the customer support!"})
    if request.method == 'PUT':
        print(request.data)
        # Treat data
        locationTagNumber = request.data['locationTagNumber']
        price = request.data['preco']
        orderList = request.data['pedido']
        customerName = request.data['customer']

        # Processes order of client
        sfn = boto3.client('stepfunctions', region_name='us-east-1')
        responseCustomerName = sfn.start_sync_execution(
            stateMachineArn=REGISTER_ORDER_ARN, name='processClientOrder', input=json.dumps(request.data))    # Register order for kitchen staff

        return JsonResponse({"msg": "Success", "name": customerName})
    else:
        return render(request, "mainMenu.html", {})
