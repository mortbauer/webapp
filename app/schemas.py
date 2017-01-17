user = {
    'email':{
        'type':'string',
        'regex':r'.*@.*',
        'maxlength':320,
        'required':True,
    }, 'username':{
        'type':'string',
        'maxlength':20,
        'minlength':3,
        'regex':r'(?=^.{3,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$', # from: http://stackoverflow.com/a/28393106/1607448
        'required':True,
    }, 'password':{
        'type':'string',
        'regex':r'^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$', # from: http://stackoverflow.com/a/5142164/1607448
        'maxlength':255,
        'minlength':8,
        'required':True,
    }, 'name':{
        'type':'string',
        'maxlength':64,
    }, 'surname':{
        'type':'string',
        'maxlength':64,
    },
}

#user = {
    #'type':'object',
    #'properties':{
        #'email':{
            #'type':'string',
            #'format':'email',
        #},
    #},
#}

sub = {
    'name':{'type':'string', 'required':True},
}

rpc = {
    'method':{'type':'string', 'required':True},
    'id':{'type':'string', 'required':True},
    'params':{'type':'dict', 'required':True},
}

transaction = {
    'id':{'type':'string', 'required':True},
    'our_iban':{'type':'string', 'required':True},
    'date':{'type':'date', 'required':True},
    'bic_blz':{'type':'string', 'required':False},
    'transaction_number':{'type':'string', 'required':False},
    'iban_knr':{'type':'string', 'required':False},
    'amount':{'type':'float', 'required':False},
    'comment':{'type':'string', 'required':False},
    'verified':{'type':'boolean', 'required':False},
    'order_group_id':{'type':'integer', 'required':False},
}
