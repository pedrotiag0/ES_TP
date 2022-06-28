import hashlib
import json

import boto3
import jwt
from django.db.models import Q
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view

from ProjetoES.models import KitchenStaff

ENCODER = "Projeto-ES2021/2022TokenPara_Encrip_tar!"
# GET_ALL_ORDERS_ARN = 'arn:aws:states:us-east-1:682866775210:stateMachine:getAllOrders' # Pedro
GET_ALL_ORDERS_ARN = 'arn:aws:states:us-east-1:931526129272:stateMachine:getAllOrders'  # Chico


@api_view(['GET', 'POST'])
def hello(request):
    return render(request, "Auth.html", {})


@api_view(['GET', 'POST'])
def index(request):
    return render(request, "index.html", {})


@api_view(['GET', 'POST'])
def loginTry(request):
    if request.method == 'POST':
        try:
            nome = str(request.data['username'])
            pw = encrypt_string(str(request.data['password']))

            utilizador = KitchenStaff.objects.filter(
                Q(name=nome) & Q(password=pw))

            if(len(utilizador) == 0):
                return JsonResponse({"msg": "Error"})

            # JWT
            token = jwt.encode({"username": nome, "password": pw}, ENCODER)

            return JsonResponse({"msg": "Success", "token": json.dumps(str(token))})
        except Exception as e:
            return JsonResponse({"msg": "Error"})
    else:
        return render(request, "LoggedIn.html", {})


def encrypt_string(hash_string):
    sha_signature = \
        hashlib.sha256(hash_string.encode()).hexdigest()
    return sha_signature


@api_view(['GET'])
def refreshOrders(request):
    if request.method == 'GET':
        try:
            username = str(json.loads(request.headers['Body'])['username'])

            staff = KitchenStaff.objects.filter(name=username).values()[0]

            receivedToken = request.headers['Authorization']
            generatedToken = jwt.encode(
                {"username": username, "password": staff['password']}, ENCODER)

            print(staff)
            print(receivedToken)
            print(generatedToken)

            if(receivedToken[1:-1] != generatedToken):
                return JsonResponse({"msg": "Error"})

            sfn = boto3.client('stepfunctions', region_name='us-east-1')
            responseAllOrders = sfn.start_sync_execution(
                stateMachineArn=GET_ALL_ORDERS_ARN, name='getAllOrders', input='{}')    # Gets all orders
            return JsonResponse({"msg": "Success", "ordersList": json.loads(responseAllOrders['output'])['Items']})
        except:
            return JsonResponse({"msg": "Error"})
