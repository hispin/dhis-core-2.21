/*
 * Copyright (c) 2004-2009, University of Oslo
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * * Neither the name of the HISP project nor the names of its contributors may
 *   be used to endorse or promote products derived from this software without
 *   specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package org.hisp.dhis.patient.action.patient;

import java.util.Collection;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.struts2.ServletActionContext;
import org.hisp.dhis.i18n.I18nFormat;
import org.hisp.dhis.organisationunit.OrganisationUnit;
import org.hisp.dhis.ouwt.manager.OrganisationUnitSelectionManager;
import org.hisp.dhis.patient.Patient;
import org.hisp.dhis.patient.PatientAttribute;
import org.hisp.dhis.patient.PatientAttributeOption;
import org.hisp.dhis.patient.PatientAttributeOptionService;
import org.hisp.dhis.patient.PatientAttributePopulator;
import org.hisp.dhis.patient.PatientAttributeService;
import org.hisp.dhis.patient.PatientIdentifier;
import org.hisp.dhis.patient.PatientIdentifierService;
import org.hisp.dhis.patient.PatientIdentifierType;
import org.hisp.dhis.patient.PatientIdentifierTypeService;
import org.hisp.dhis.patient.PatientService;
import org.hisp.dhis.patient.idgen.PatientIdentifierGenerator;
import org.hisp.dhis.patient.state.SelectedStateManager;
import org.hisp.dhis.patientattributevalue.PatientAttributeValue;
import org.hisp.dhis.patientattributevalue.PatientAttributeValueService;

import com.opensymphony.xwork2.Action;

/**
 * @author Abyot Asalefew Gizaw
 * @version $Id$
 */
public class AddPatientAction implements Action {
	public static final String PREFIX_ATTRIBUTE = "attr";

	public static final String PREFIX_IDENTIFIER = "iden";

	// -------------------------------------------------------------------------
	// Dependencies
	// -------------------------------------------------------------------------

	private I18nFormat format;

	private PatientService patientService;

	private PatientIdentifierService patientIdentifierService;

	private PatientIdentifierTypeService patientIdentifierTypeService;

	private OrganisationUnitSelectionManager selectionManager;

	private SelectedStateManager selectedStateManager;

	private PatientAttributeService patientAttributeService;

	private PatientAttributeValueService patientAttributeValueService;

	private PatientAttributeOptionService patientAttributeOptionService;

	// -------------------------------------------------------------------------
	// Input - name
	// -------------------------------------------------------------------------
	private String firstName;

	private String middleName;

	private String lastName;

	// -------------------------------------------------------------------------
	// Input - demographics
	// -------------------------------------------------------------------------

	private String birthDate;

	private Integer age;

	private boolean birthDateEstimated;

	private String gender;

	private String bloodGroup;

	private String childContactIdentifierName;

	private String childContactIdentifierType;

	// -------------------------------------------------------------------------
	// Output - making the patient available so that its attributes can be
	// edited
	// -------------------------------------------------------------------------

	private Patient patient;

	public Patient getPatient() {
		return patient;
	}

	// -------------------------------------------------------------------------
	// Action implementation
	// -------------------------------------------------------------------------

	public String execute() {
		// ---------------------------------------------------------------------
		// Prepare values
		// ---------------------------------------------------------------------

		OrganisationUnit organisationUnit = selectionManager
				.getSelectedOrganisationUnit();

		patient = new Patient();

		patient.setFirstName(firstName.trim());
		patient.setMiddleName(middleName.trim());
		patient.setLastName(lastName.trim());
		patient.setGender(gender);
		patient.setBloodGroup(bloodGroup);

		if (birthDate != null) {
			birthDate = birthDate.trim();

			if (birthDate.length() != 0) {
				patient.setBirthDate(format.parseDate(birthDate));
				patient.setBirthDateEstimated(birthDateEstimated);
			} else {
				if (age != null) {
					patient.setBirthDateFromAge(age.intValue());
				}
			}
		} else {
			if (age != null) {
				patient.setBirthDateFromAge(age.intValue());
			}
		}

		patient.setRegistrationDate(new Date());

		patientService.savePatient(patient);

		// --------------------------------------------------------------------------------
		// Generate system id with this format :
		// (BirthDate)(Gender)(XXXXXX)(checkdigit)
		// PatientIdentifierType will be null
		// --------------------------------------------------------------------------------

		String identifier = PatientIdentifierGenerator.getNewIdentifier(patient
				.getBirthDate(), patient.getGender());

		PatientIdentifier systemGenerateIdentifier = patientIdentifierService
				.get(null, identifier);
		while (systemGenerateIdentifier != null) {
			identifier = PatientIdentifierGenerator.getNewIdentifier(patient
					.getBirthDate(), patient.getGender());
			systemGenerateIdentifier = patientIdentifierService.get(null,
					identifier);
		}

		systemGenerateIdentifier = new PatientIdentifier();
		systemGenerateIdentifier.setIdentifier(identifier);
		systemGenerateIdentifier.setOrganisationUnit(organisationUnit);
		systemGenerateIdentifier.setPatient(patient);

		patientIdentifierService
				.savePatientIdentifier(systemGenerateIdentifier);

		selectedStateManager.clearListAll();
		selectedStateManager.clearSearchingAttributeId();
		selectedStateManager.setSearchText(systemGenerateIdentifier
				.getIdentifier());

		// --------------------------------------
		// Deal with child < 5 years old
		// --------------------------------------
		boolean isChild5 = false;

		if (patient.getIntegerValueOfAge() < 5) {
			isChild5 = true;

			// -----------------------------------------------------------------------------
			// Get Child Contact Name attribute
			// -----------------------------------------------------------------------------
			PatientAttribute attrChildContactName = patientAttributeService
					.getPatientAttributeByName(PatientAttributePopulator.ATTRIBUTE_CHILD_CONTACT_NAME);
			patient.getAttributes().add(attrChildContactName);

			// -----------------------------------------------------------------------------
			// Get Child Contact RelationShip Type attribute
			// -----------------------------------------------------------------------------
			PatientAttribute arrChildRelationShipType = patientAttributeService
					.getPatientAttributeByName(PatientAttributePopulator.ATTRIBUTE_CHILD_RELATIONSHIP_TYPE);
			patient.getAttributes().add(arrChildRelationShipType);

			// -----------------------------------------------------------------------------
			// Save value for Child Contact Name attribute
			// -----------------------------------------------------------------------------
			PatientAttributeValue childContactValue = new PatientAttributeValue();
			childContactValue.setPatient(patient);
			childContactValue.setPatientAttribute(attrChildContactName);
			childContactValue.setValue(childContactIdentifierName);
			patientAttributeValueService
					.savePatientAttributeValue(childContactValue);

			// -----------------------------------------------------------------------------
			// Save value for Child Contact RelationShip Type attribute
			// -----------------------------------------------------------------------------
			PatientAttributeValue childRelationShipValue = new PatientAttributeValue();
			childRelationShipValue.setPatient(patient);
			childRelationShipValue
					.setPatientAttribute(arrChildRelationShipType);
			childRelationShipValue.setValue(childContactIdentifierType);
			patientAttributeValueService
					.savePatientAttributeValue(childRelationShipValue);

			patientService.updatePatient(patient);
		}

		// -----------------------------------------------------------------------------
		// Save Patient Attributes
		// -----------------------------------------------------------------------------
		Collection<PatientAttribute> attributes = patientAttributeService
				.getAllPatientAttributes();

		HttpServletRequest request = ServletActionContext.getRequest();

		PatientAttributeValue attributeValue = null;
		String value = null;

		if (attributes != null && attributes.size() > 0) {
			for (PatientAttribute attribute : attributes) {
				value = request.getParameter(PREFIX_ATTRIBUTE
						+ attribute.getId());
			    System.out.println("attribute value : "+value);
				if (StringUtils.isNotBlank(value)) {
					if (!patient.getAttributes().contains(attribute)) {
						patient.getAttributes().add(attribute);
					}

					attributeValue = new PatientAttributeValue();
					attributeValue.setPatient(patient);
					attributeValue.setPatientAttribute(attribute);

					if (PatientAttribute.TYPE_COMBO.equalsIgnoreCase(attribute
							.getValueType())) {
						PatientAttributeOption option = patientAttributeOptionService
								.get(NumberUtils.toInt(value, 0));
						if (option != null) {
							attributeValue.setPatientAttributeOption(option);
							attributeValue.setValue(option.getName());
						} else {
							// Someone deleted this option ...
						}
					} else {
						attributeValue.setValue(value.trim());
					}
					patientAttributeValueService
							.savePatientAttributeValue(attributeValue);
				}
			}
			patientService.updatePatient(patient);
		}

		// -----------------------------------------------------------------------------
		// Save Patient Identifiers
		// -----------------------------------------------------------------------------
		Collection<PatientIdentifierType> identifierTypes = patientIdentifierTypeService
				.getAllPatientIdentifierTypes();

		PatientIdentifier pIdentifier = null;

		if (identifierTypes != null && identifierTypes.size() > 0) {
			for (PatientIdentifierType identifierType : identifierTypes) {
				value = request.getParameter(PREFIX_IDENTIFIER
						+ identifierType.getId());

				if (StringUtils.isNotBlank(value)) {
					pIdentifier = new PatientIdentifier();
					pIdentifier.setIdentifierType(identifierType);
					pIdentifier.setPatient(patient);
					pIdentifier.setOrganisationUnit(organisationUnit);
					pIdentifier.setIdentifier(value.trim());
					// -----------------------------------------------------
					// If isChild5 == TRUE : all identifiers is temporary
					// -----------------------------------------------------
					pIdentifier.setTemporary(isChild5 ? true : false);
					patientIdentifierService.savePatientIdentifier(pIdentifier);
					patient.getIdentifiers().add(pIdentifier);
				}
			}
			patientService.updatePatient(patient);
		}

		return SUCCESS;
	}

	// -----------------------------------------------------------------------------
	// Getter/Setter
	// -----------------------------------------------------------------------------

	public void setPatientIdentifierTypeService(
			PatientIdentifierTypeService patientIdentifierTypeService) {
		this.patientIdentifierTypeService = patientIdentifierTypeService;
	}

	public void setChildContactIdentifierName(String childContactIdentifierName) {
		this.childContactIdentifierName = childContactIdentifierName;
	}

	public void setChildContactIdentifierType(String childContactIdentifierType) {
		this.childContactIdentifierType = childContactIdentifierType;
	}

	public void setBirthDate(String birthDate) {
		this.birthDate = birthDate;
	}

	public void setFormat(I18nFormat format) {
		this.format = format;
	}

	public void setPatientService(PatientService patientService) {
		this.patientService = patientService;
	}

	public void setPatientIdentifierService(
			PatientIdentifierService patientIdentifierService) {
		this.patientIdentifierService = patientIdentifierService;
	}

	public void setSelectionManager(
			OrganisationUnitSelectionManager selectionManager) {
		this.selectionManager = selectionManager;
	}

	public void setSelectedStateManager(
			SelectedStateManager selectedStateManager) {
		this.selectedStateManager = selectedStateManager;
	}

	public void setPatientAttributeService(
			PatientAttributeService patientAttributeService) {
		this.patientAttributeService = patientAttributeService;
	}

	public void setPatientAttributeValueService(
			PatientAttributeValueService patientAttributeValueService) {
		this.patientAttributeValueService = patientAttributeValueService;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public void setBirthDateEstimated(boolean birthDateEstimated) {
		this.birthDateEstimated = birthDateEstimated;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public void setBloodGroup(String bloodGroup) {
		this.bloodGroup = bloodGroup;
	}

	public void setPatientAttributeOptionService(
			PatientAttributeOptionService patientAttributeOptionService) {
		this.patientAttributeOptionService = patientAttributeOptionService;
	}
}
