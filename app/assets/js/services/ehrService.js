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

		self.getUserData = function (callback) {
			$.ajax({type: 'GET',
					url: self.baseUrl + "/demographics/ehr/" + self.ehrId + "/party",
					headers: {
                		"Ehr-Session": self.sessionId
            		},
            		success: function (data) {
            			callback(data.party);
            		}
				})
			/*
			function patientData() {
        return $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (data) {
                var party = data.party;

                // Name
                $("#patient-name").html(party.firstNames + ' ' + party.lastNames);

                // Complete age
                var age = getAge(formatDateUS(party.dateOfBirth));
                $(".patient-age").html(age);

                // Date of birth
                var date = new Date(party.dateOfBirth);
                var stringDate = monthNames[date.getMonth()] + '. ' + date.getDate() + ', ' + date.getFullYear();
                $(".patient-dob").html(stringDate);

                // Age in years
                $(".patient-age-years").html(getAgeInYears(party.dateOfBirth));

                // Gender
                var gender = party.gender;
                $("#patient-gender").html(gender.substring(0, 1) + gender.substring(1).toLowerCase());

                // Patient's picture
                var imageUrl;
                if (party.hasOwnProperty('partyAdditionalInfo')) {
                    party.partyAdditionalInfo.forEach(function (el) {
                        if (el.key === 'image_url') {
                            imageUrl = el.value;
                        }
                    });
                }
                if (imageUrl !== undefined) {
                    $('.patient-pic').css('background', 'url(' + imageUrl + ')');
                } else {
                    $('.patient-pic').css('background', 'url(./img/conchita.jpg) center no-repeat');
                }
            }
        });
    }

			*/
		}

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
									'&commiterName=stephenallison' +
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
                                                            medication.originalDose
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
                                    medication.name() + ' ' +medication.originalDose
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
				        "composer_name": "Stephen Alison"
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