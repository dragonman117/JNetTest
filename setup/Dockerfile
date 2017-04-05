############################################################
# Dockerfile to build sandbox for executing user code
# Based on Latest Stable Ubuntu at time of build
############################################################

FROM ubuntu:latest

# Below 2 lines are best current workaround for ubuntu 16 lts bug. Will throw 1 line warnning...
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install --assume-yes apt-utils

RUN apt-get install bc

#Install all the languages/compilers we are supporting.
RUN apt-get install -y gcc
RUN apt-get install -y g++
RUN chmod 777 /

#commented out all other languages as we are focusing cpp right now

#RUN apt-get install -y ruby
#RUN apt-get install -y python

#RUN apt-get install -y npm
#RUN apt-get install -y golang-go


#prepare for Java download
#RUN apt-get install -y python-software-properties
#RUN apt-get install -y software-properties-common

#grab oracle java (auto accept licence)
#RUN add-apt-repository -y ppa:webupd8team/java
#RUN apt-get update
#RUN echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
#RUN apt-get install -y oracle-java7-installer


#RUN apt-get install -y gobjc
#RUN apt-get install -y gnustep-devel &&  sed -i 's/#define BASE_NATIVE_OBJC_EXCEPTIONS     1/#define BASE_NATIVE_OBJC_EXCEPTIONS     0/g' /usr/include/GNUstep/GNUstepBase/GSConfig.h


#RUN apt-get install -y scala