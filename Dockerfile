FROM ubuntu:latest
LABEL authors="ivintern"

ENTRYPOINT ["top", "-b"]