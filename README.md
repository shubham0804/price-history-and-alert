# Price Histoy & Alert

A chatbot that integrates with messaging apps such as Whatsapp to get the price history of a product and let the user know if the price of the product drops in the future _(under development)_

# Demo

**Step-1.** Install Whatsapp thorugh [Play Store](https://play.google.com/store/apps/details?id=com.whatsapp&hl=en_IN&gl=US)/[App Store](https://apps.apple.com/in/app/whatsapp-messenger/id310633997) or login on [Whatsapp Web](https://web.whatsapp.com/)/[Whatsapp Desktop](https://www.whatsapp.com/download).<br>
**Step-2.** [Click Here](https://wa.me/message/UV723AOEQM55A1) or scan qr code below to start the chat & click on the Send button.<br>
<img src="https://storage.googleapis.com/is-price-right/qr-code.jpg" height="150"><br>
**Step-3.** An introductory message along with a video will be recieved showing how to share the product whose price history or alert is required.<br>
<img src="https://storage.googleapis.com/is-price-right/intro-mssg.jpg" height="350"><br>
**Step-4.** Share the product in the chat.<br>
**Step-5.** An image & summary of the price history for the product should be recieved within 15-20 sec.<br>
<img src="https://storage.googleapis.com/is-price-right/price-graph.jpg" height="350"><br>
**Step-6.** The bot then asks if a notification should be sent if the price drops.<br>
<img src="https://storage.googleapis.com/is-price-right/recieve-notification.jpg" height="80"><br>
**Step-6.** A shortened affiliate link is sent if the product was from Amazon India.<br>
<img src="https://storage.googleapis.com/is-price-right/affiliate-link.jpg" height="80"><br>

## Features

-   Typing indicators are shown before each message is recieved to mimic normal messaging.
-   Shortened affiliate links _(currently only of Amazon India)_ are generated and sent to the appropriate stage of the conversation.
-   Price history for the product is retrieved from a 3rd party.
-   [Whatsapp Labels](https://faq.whatsapp.com/smba/chats/using-labels/?lang=en) are used to identify whether the user has sent the message for the first time as well as to track the state of the conversation, if required.
-   The user is notified (only during daytime of their country) of any price drops in the future. _(under development)_
-   Incase the user shares a product from a website/app that is currently not supported, an appropriate message is sent letting them know of the currently supported websites/apps.
-   Input from the user is handled in a conversational manner, with hints as to what is expected in the reply. Incase the user sends an unsupported reply, it is handled accordingly.
-   The user is informed when the information is being processed.
-   Emojis are used abundently, to enrich the messages.

## Supported Ecommerce Websites/Apps

-   Amazon India
-   Flipkart
-   Myntra _(under develpment)_
-   PayTm Mall _(under develpment)_
-   Nyakaa _(under develpment)_

## Backend

-   Database: Mongodb on [Atlas](https://www.mongodb.com/cloud/atlas)
-   Server hosted on GCP Ubuntu VM

## Libraries Primarily Used

-   [Wa Automate](https://www.npmjs.com/package/@open-wa/wa-automate)<br>
    Messages from Whatsapp are sent & recieved using this library.
-   [Axios](https://www.npmjs.com/package/axios)<br>
    Network requests to the Whatsapp session are sent using Axios.
-   [Puppeteer]()<br>
    Data of the product is retrieved from a 3rd party using Pupeteer
-   [Local Tunnel]()<br>
    Used to quickly create a reverse proxy to integrate the Whatsapp session with rest of the logic.
-   [Mongoose](https://www.npmjs.com/package/mongoose)<br>
    To interact with MongoDb.
-   [Get Urls](https://www.npmjs.com/package/get-urls),[tldts](https://www.npmjs.com/package/tldts)<br>
    To get url of the product whose data is required & parse the domain name.
