#!/bin/bash

rm -rf dump
mongodump --host rs01.aquaria.parameter1.com --username $USER --password $PASSWORD --authenticationDatabase admin -d parcel-plug
mongodump --host rs01.aquaria.parameter1.com --username $USER --password $PASSWORD --authenticationDatabase admin -d parcel-plug-example
mongorestore --host localhost:11001 --drop
