# iotstack

The start of my home IoT stack. This project was inspired by [AWS IoT's Architecture](https://aws.amazon.com/iot/how-it-works/).

![AWS Infrastructure](https://d0.awsstatic.com/products/IceBx_HowITWorks.png)

So far I have each component somewhat implemented.
Starting on the left, I have the SDK in the form of using the [Wink Hub](http://www.wink.com/) and the security by using their [API](http://docs.wink.apiary.io/).
The message format is just json for now but I'll investigate adding a broker.
The device shadows are implemented using Hapi and RethinkDB to provide an API by which to update a device state.
There are callbacks built into the device models that run on state change.

Currently, adding/modifying devices is a manual task.
