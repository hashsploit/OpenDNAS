# OpenDNAS

An Open Source replacement DNAS server.

### What is OpenDNAS
OpenDNAS is an Open Source implementation of the production DNAS
servers hosted by SCEI for authenticating Sony PlayStation(tm)
clients to play multiplayer games.

On April 4, 2016; SCEI discontinued the official DNAS servers,
thus forcefully taking down hundreds of multiplayer game titles with it.

OpenDNAS aims to be a solution to this, providing successful
authentication for emulators and genuine PlayStation(tm)'s.

The original design of OpenDNAS was to use nginx with a
older OpenSSL version that supports SSLv2 connections.
However nginx does not provide a HTTP/1.0 response.
Therefore it required this project run on Apache.

This project was inspired by the [DNASrep](https://github.com/FogNo23/DNASrep) project.

## Requirements
- apache2
- OpenSSL 1.0.2i (or older, as long as it supports SSLv2)
- php7.0.15-fpm (mcrypt_encrypt [removed in 7.2](https://www.php.net/manual/en/function.mcrypt-encrypt.php))

## Installation

### Please do not run this service on a production system directly.

This service requires OpenSSL 1.0.2i (SSLv2) which is not secure.
This service also requires the use of an older version of php to use
the `mcrypt_encrypt()` function which was deprecated in php7.2 and removed
in php7.3.

This project should be run in a container instead.
Take a look at [hnc-opendnas](https://github.com/hashnet0/hnc-opendnas).

