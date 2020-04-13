# OpenDNAS

An Open Source replacement DNAS server.

### What is OpenDNAS
OpenDNAS is a Open Source implementation of the production DNAS servers hosted by SCEI for authenticating Sony PlayStation clients to play multiplayer games.

On April 4, 2016; SCEI discontinued the official DNAS servers, thus forcefully taking down hundreds of multiplayer game titles with it.

OpenDNAS aims to be a solution to this, providing successful authentication for emulators and genuine PlayStations.


### Requirements
- nginx
- OpenSSL 1.0.2i (or older, as long as it supports SSLv2)
- php7.3-fpm


### Installation
Please do not run this application on a production system directly. This application requires OpenSSL 1.0.2i (SSLv2) to be compiled which is not secure anymore.

Instead use a container. Such as [hnc-opendnas](https://github.com/hashsploit/hnc-opendnas).

A sample `nginx.vhost` has been provided.

- The `certs/` directory should become `/etc/nginx/certs`.
- The `public/` directory should become `/var/www/OpenDNAS/public`.
- The `nginx.vhost` file should be configured, added to `/etc/nginx/sites-available`, and then linked to `/etc/nginx/sites-enabled`.
- You will need to generate your own SSL cert for `opendnas.localhost`.
