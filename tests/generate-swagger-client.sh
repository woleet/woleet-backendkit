#!/usr/bin/env bash
# Use this script to generate the Swagger client code for the backend kit API (used for tests).
# =============================================================================================

SWAGGER_CODEGEN='swagger-codegen'

# Generation of Javascript SDK
$SWAGGER_CODEGEN generate -i ../swagger.yaml -l javascript -o swagger-generated

