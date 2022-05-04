public with sharing class SendMail {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accountId){
        System.debug('Account ID is '+accountId);
        System.debug('Data ID is '+[Select Id,Name,Email from Contact where accountId=:accountId]);
        return [Select Id,Name,Email from Contact where accountId=:accountId];
         
    }  

    @AuraEnabled
    public static String setMail(List<String> emails,String subject,String body) {
        System.debug('EmailSize '+emails);
        System.debug('EmailSize '+emails.size());
        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new List<String>(emails));
        mail.setReplyTo('nischalvasisth6@gmail.com');
        mail.setSenderDisplayName('Aura');
        mail.setSubject(subject);
        mail.setBccSender(false);
        mail.setUseSignature(false);
        mail.setPlainTextBody(body);
        mail.setHtmlBody(body);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        System.debug('BIdy is'+body);
        return 'Mail Sent';
    }
}
