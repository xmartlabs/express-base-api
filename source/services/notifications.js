const NotifmeSdk = require('notifme-sdk').default;
const appConfig = require('config');

module.exports = () => {
  const notifier = new NotifmeSdk(appConfig.get('pushNotifications'));
  
  //NOTE: is usefull to leave this exported since is possible to send multiple notifications
  const send = async (data) => {
    try {
      return await notifier.send(data);
    } catch (err) {
      log.error('Unexpected error while sending web push notifications', err);
      throw err;
    }
  }

  return {
    send,
    sendPushNotification: async (token, title, body, icon) => await send({push: {token, title, body, icon}}),
    //EXAMPLE: webpush subscription attribute format: { keys: { auth: 'xxxxx', p256dh: 'xxxxx' }, endpoint: 'xxxxx' }
    sendWebPushNotification: async (subscription, title, body, icon) => await send({webpush: {subscription, title, body, icon}}),
    sendEmail: async (from, to, subject, html) => await send({email: {from, to, subject, html}}),
    sendSMS: async (from, to, text) => await send({sms: {from, to, text}}),
    sendSlackMessage: async (text) => await send({slack: text}),
    sendVoiceMessage: async (from, to, url) => await send({voice: {from, to, url}})
  };
};
