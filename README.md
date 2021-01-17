### This project is no longer being worked on because nginx only supports HTTP/1.1 which does not work with DNAS (DNAS requires HTTP/1.0)

Use [clank-dnas](https://github.com/hashsploit/clank-dnas) instead.

## OpenDNAS

An Open Source replacement DNAS server.

### What is OpenDNAS
OpenDNAS is a Open Source implementation of the production DNAS servers hosted by SCEI for authenticating Sony PlayStation clients to play multiplayer games.

On April 4, 2016; SCEI discontinued the official DNAS servers, thus forcefully taking down hundreds of multiplayer game titles with it.

OpenDNAS aims to be a solution to this, providing successful authentication for emulators and genuine PlayStations.


### Requirements
- nginx (DNAS does not work with HTTP/1.1 ...)
- OpenSSL 1.0.2i (or older, as long as it supports SSLv2).
- php7.0.15-fpm (mcrypt_encrypt [removed in 7.2](https://www.php.net/manual/en/function.mcrypt-encrypt.php)).


### Installation
Please do not run this application on a production system directly. This application requires OpenSSL 1.0.2i (SSLv2) to be compiled which is not secure anymore.

Instead use a container. Such as [clank-dnas](https://github.com/hashsploit/clank-dnas).

A sample `nginx.vhost` has been provided.

- The `certs/` directory should become `/etc/nginx/certs`.
- The `public/` directory should become `/var/www/OpenDNAS/public`.
- The `nginx.vhost` file should be configured, added to `/etc/nginx/sites-available`, and then linked to `/etc/nginx/sites-enabled`.
- You will need to generate your own SSL cert for `opendnas.localhost`.
