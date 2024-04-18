const sendEmailSuccess: any = {
  accepted: [ 'user@test.com' ],
  rejected: [],
  ehlo: [ 'PIPELINING', '8BITMIME', 'SMTPUTF8', 'AUTH LOGIN PLAIN' ],
  envelopeTime: 652,
  messageTime: 452,
  messageSize: 19252,
  response: '250 Accepted [STATUS=new MSGID=Zh8MHx4jA5Gy3PUrZh8UN6ytuXFU34hsAAAABKXpYqRlpTROSE80mIeRVtQ]',
  envelope: {
    from: 'pawsly.connect@gmail.com',
    to: [ 'user@test.com' ]
  },
  messageId: '<bf1a98aa-d243-77d7-8b99-c3fb79e73407@gmail.com>'
}

const renderSuccess: any = {
    html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\
    <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"></html>',
    subject: null
  }

export default {
    sendEmailSuccess: sendEmailSuccess,
    renderSuccess: renderSuccess
};
