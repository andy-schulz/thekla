---
title: Ref:Abilities
has_children: true
nav_order: 12
---

# Abilities

An ability provides specific capabilities to an actor. As of now the following theree abilities are implemented

- [BrowseTheWeb](abilities/BROWSE_THE_WEB.md)
- [OperateOnMobileDevice](abilities/OPERATE_ON_MOBILE_DEVICE.md)
- [UseTheRestApi](abilities/USE_THE_REST_API.md)

BrowseTheWeb and OperateOnMobileDevice are wrappers around the [webdriverio](https://www.npmjs.com/package/webdriver) client, whereas UseTheRestApi is a wrapper
around the [request](https://www.npmjs.com/package/request) client.

