
import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContacts from '@salesforce/apex/SendMail.getContacts';
import setMail from '@salesforce/apex/SendMail.setMail';

const columns = [{
    label: 'Name',
    fieldName: 'Name'
},
{
    label: 'Email',
    fieldName: 'Email',
    type: 'email'
}

];

export default class EmailComp extends LightningElement {
    data = [];
    columns = columns;
    step = '1';
    @api recordId;
    boolvalue = true;
    emaildata = '';
    subject = '';
    body = '';
    hasError = false;


    @wire(getContacts, {
        accountId: '$recordId'
    }) listView;

    callToast(msg){
        let evt = new ShowToastEvent({
            title: 'Success',
            message: msg,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    connectedCallback() {
        this.callToast('connectedCallback')
        alert('ID is  ' + this.recordId)
    }

    get contacts() {
        return this.listView.data;
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.data = [];
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++) {

            console.log('data   ' + this.data);
            this.data.push(selectedRows[i].Email);
            alert('You selected: ' + selectedRows[i].Email);
        }
    }

    handleClick(event) {

        if (event.target.label === 'Email') {

            this.data.forEach((element) => {
                this.emaildata += element + ',';
            });
            this.emaildata = this.emaildata.substring(0, this.emaildata.length - 1);
            this.boolvalue = false;
            this.step = '2';
            console.log(this.data + '  data >< emaildta  ' + this.emaildata);
            alert(this.data + '   ' + this.emaildata);
        } else if(event.target.label === 'Previous'){
            this.data=[];
            this.emaildata='';
            this.boolvalue = true;
            this.step = '1';
        }else {
            console.log(this.body+'   body> < subject '+this.subject);
            setMail({emails:this.data,subject:this.subject,body:this.body})
            .then(result => {
                this.callToast(''+result);
            })
            .catch(error => {
                this.callToast(error);
            });
        }

    }

    changeHandler(event) {
        if (event.target.label === 'EmailBody')
            this.body = event.target.value;
        else
            this.subject = event.target.value;
    }
}