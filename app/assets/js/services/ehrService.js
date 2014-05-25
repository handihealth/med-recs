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
			$.ajax({type: 'POST',
				url: self.baseUrl + '/composition?ehrId=' + self.ehrId + 
									'&templateId=' + encodeURIComponent('Meds Rec Report (composition)') + 
									'&commiterName=handi' +
									'&format=STRUCTURED',
				headers: {
					contentType: "application/json",
					"Ehr-Session": self.sessionId
				},
				data: JSON.stringify(self.getjson(medicationsList))
			});
		};

		self.jsonForSingleItem = function (medication) {
			var obj = {
				"openhr_medication": [
                    {
                        "medication_order": [
                            {
                                "medication_order_activity": [
                                    {
                                        "medication_item": [
                                            {
                                                "medication_name": [
                                                    {
                                                        "|other": medication.name()
                                                    }
                                                ],
                                                "dose_directions": [
                                                    {
                                                        "dose_directions_description": [
                                                            'test'
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],

                                        "timing": [
                                            {
                                                "|value": "123",
                                                "|formalism": "Some_dummy_formalism"
                                            }
                                        ]
                                    }
                                ],
                                "medication_status": [
                                    {
                                        "medication_course_status": [
                                            {
                                                "|code": "at0019",
                                                "|value": "Discontinued",
                                                "|terminology": "local"
                                            }
                                        ]
                                    }
                                ],
                                "narrative": [
                                    "Locorten Vioform ear drops (Amdipharm) 2 DROPS THREE TIMES A DAY 7.5 ml"
                                ]
                            }
                        ]
                 }
                ],
			"medicine_reconciliation":[
                    {
                        "discrepancy_identified": [
                            {
                                "|code": "at0030",
                                "|value": "Discrepancy identified",
                                "|terminology": "local"
                            }
                        ]
                    }
                    ],
            };
            return obj;	
		};


		self.getjson = function (medicationList) {

			var medsjson = [];
			for (var i=0; i<medicationList.length; i++) {
				var jsn = self.jsonForSingleItem(medicationList[i]);
				medsjson.push(jsn);
			}

			return {
				    "ctx": {
				        "language": "en",
				        "territory": "GB",
				        "composer_name": "Medresca Wurst"
				    },
				    "meds_rec_report": {
				        "openhr_medication_events": medsjson,
				        "context": [
				            {
				                "setting": [
				                    {
				                        "|code": "233",
				                        "|value": "secondary nursing care",
				                        "|terminology": "openehr"
				                    }
				                ],
				                "start_time": [
				                    "2015-01-01T00:00:00.000+02:00"
				                ]
				            }
				        ]
				    }
				}
		};

	
}});