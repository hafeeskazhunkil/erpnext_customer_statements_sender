// Copyright (c) 2020, Dirk van der Laarse and contributors
// For license information, please see license.txt

frappe.ui.form.on('Customer Statements Sender', {
  refresh: function(frm) {
    // Hide Add Row button
    $('div[id="page-Form/Customer Statements Sender"] div.small.form-clickable-section.grid-footer').css({'display': 'none'});
    // Default values in From and To Dates
    var today = frappe.datetime.nowdate();
    frm.set_value('from_date', frappe.datetime.month_start(today));
    frm.set_value('to_date', today);
  },
	get_customer_emails: function(frm) {
    frappe.call({
      method: "populate_recipient_list",
      doc: frm.doc,
      callback: function(r) {
          cur_frm.refresh_field('recipients');
          cur_frm.save();
      }
    });
	},
	send_customer_statements: function(frm) {
    let validRecipients = frm.doc.recipients.filter(c => c.send_statement === "Yes").length;
    frappe.confirm(
        'Are you sure you want to send Customer Statement Emails to <b>' + validRecipients + '</b> customers?',
        function(){
            window.close();
        },
        function(){
          frappe.call({
            method: "erpnext_customer_statements_sender.api.statements_sender_scheduler",
            args: {
              manual: true
            },
            callback: function(r) {
            }
          });
        }
    );
	},
  preview: function(frm) {
    if(frm.doc.customer != undefined && frm.doc.customer != ""){
      frappe.call({
        method: "erpnext_customer_statements_sender.api.get_report_content",
        args: {
          company: frm.doc.company,
          customer_name: frm.doc.customer,
          from_date: frm.doc.from_date,
          to_date: frm.doc.to_date
        },
        callback: function(r) {
          var x=window.open();
          x.document.open().write(r.message);
        }
      });
    }
    else {
      frappe.msgprint('Please select a customer');
    }
  },
  letter_head: function(frm) {
    cur_frm.save();
  },
  no_ageing: function(frm) {
    cur_frm.save();
  }

});
