'use strict';

/* global define:true*/
define(['knockout'],
function (ko) {
	return function (params) {
		var self = this;
		self.name = ko.observable(params.value);
		self.originalDose = params.dose;
		self.newDose = ko.observable(self.originalDose);
		self.status = ko.observable('');
		self.patientNote = ko.observable('No notes');
		self.userCreated = ko.observable(false);

		self.statusSet = ko.computed(function () {
			return self.status() !== '';
		});
		self.coloredstatus = ko.computed(function() {
			var Color;
			switch (self.status()) {
				case 'As prescribed':  Color = 'green'; break;
				case 'Changed Dose': Color = '#FBB917'; break;
				case 'Not Taking': Color = 'red'; break;
				case 'Newly added': Color = 'blue'; break;						
			}
			return Color;
		});

		self.notUserCreated = ko.computed(function () {
			return !self.userCreated();
		});

		self.setStatus = function (newStatus, note) {
			self.status(newStatus);
			if (note !== undefined) {
				self.setPatientNote(note);
			}
		};

		self.setPatientNote = function (newNote) {
			self.patientNote(newNote);
		};

		
	};
});