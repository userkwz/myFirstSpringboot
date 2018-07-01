function getWTGAJInfo() {

    iceGetData(function(servicePrx) {
        servicePrx.getWTGAJInfo('', '370000').then(z_databack1);
    });

    function z_databack1(_z_Data1) {
        _z_Data1 = JSON.parse(_z_Data1);
        console.log(_z_Data1);
    }
}

var ip = '192.168.2.183';

//ICE封装
function iceGetData(callback) {
    Ice.Promise.try(
            function() {
                var iceData = new Ice.InitializationData();
                iceData.properties = Ice.createProperties();
                iceData.properties.setProperty("Ice.MessageSizeMax", "102400");
                iceData.properties.setProperty("Ice.Default.Locator", "BigDataAppServer/Locator:ws -h " + ip + " -p 12001");
                var communicator = Ice.initialize(iceData);
                var proxy = communicator.stringToProxy("DataValidataService");
                return TJRH.CASSPASS.IDataValidateServicePrx.checkedCast(proxy).then(
                    function(servicePrx) {
                        callback(servicePrx);
                    }
                );
            }
        )
        .finally(function() {
            if (communicator) {
                console.log("communicator.destroy()");
            }
        })
		.exception(function (ex) {
				console.log("error");
			}
		);
}