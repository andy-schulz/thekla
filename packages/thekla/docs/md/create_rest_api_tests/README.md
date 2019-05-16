# Use your Rest API with Thekla

To use a REST API in your tests you have to do the following steps:

1. create a request
1. create an actor with the ability ``UseTheRestApi``
1. execute your request

## Create a Request

create a request:

```typescript
import {request} from "thekla"

const mathGetRequest = request(On.resource())
```

## Create an actor with the ability to use a REST API

## Execute your Requests

## 