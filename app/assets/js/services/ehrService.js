'use strict';

/* global define:true*/
define(['jquery', '../models/medication.js'],
function ($, Medication) {
	return function () {
		var self = this;

		self.baseUrl = 'https://rest.ehrscape.com/rest/v1';
		self.ehrId = 'a3f30697-1223-473e-bd4b-0f72e64d7a24';
		self.username = 'handi';
		self.password = 'RPEcC859';
		self.sessionId = '';

		self.login = function (callback) {
			$.ajax({type: 'POST',
					url: self.baseUrl + '/session?' + $.param({username: self.username, password: self.password}),
					success: function (res) {
						self.sessionId = res.sessionId;
						console.log('Logged in.  Session Id:' + self.sessionId);
						callback();
					}
			});
		};

		self.getUKMedications = function (arrayToStoreResults) {
			$.ajax({type: 'GET',
					url: self.baseUrl + "/query/?aql="+ encodeURIComponent("select a_b/items[at0001]/value/value as value, a_b/items[at0019]/items[at0003]/value/value as dose from EHR e[ehr_id/value='a3f30697-1223-473e-bd4b-0f72e64d7a24'] contains COMPOSITION a         contains (             INSTRUCTION a_a[openEHR-EHR-INSTRUCTION.medication_order_uk.v1]         contains CLUSTER a_b[openEHR-EHR-CLUSTER.medication_item.v1]         and         CLUSTER m_s[openEHR-EHR-CLUSTER.medication_status.v1])         where m_s/items[at0030]/value/defining_code/code_string='at0033'         offset 0 limit 20"),
					headers: {
					'Ehr-Session': self.sessionId
					},
					success: function (res) {
						for (var i = 0; i < res.resultSet.length; i++) {
							console.log('Loaded medication ' + res.resultSet[i].value);
							arrayToStoreResults.push(new Medication(res.resultSet[i]));
						} 
					},
					error: function () {
						alert('fail');
					}
			});
		};

		self.postUpdateMedications = function (medicationsList) {

		};

	};
});