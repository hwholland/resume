var oTestModel = {
	"version": "1.0",
	"dataServices": {
		"dataServiceVersion": "2.0",
		"schema": [
			{
				"namespace": "ZMEY_SRV",
				"entityType": [
					{
						"name": "Project_Type",
						"key": {
							"propertyRef": [
								{
									"name": "ID"
								}
							]
						},
						"property": [
							{
								"name": "ID",
								"type": "Edm.Int32",
								"nullable": "false",
								"extensions": [
									{
										"name": "creatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "updatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "Name",
								"type": "Edm.String",
								"nullable": "false",
								"maxLength": "24",
								"extensions": [
									{
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "Description",
								"type": "Edm.String",
								"nullable": "false",
								"maxLength": "80",
								"extensions": [
									{
										"name": "field-control",
										"value": "Description_FC",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "StartDate",
								"type": "Edm.DateTime",
								"precision": "0",
								"extensions": [
									{
										"name": "display-format",
										"value": "Date",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "field-control",
										"value": "StartDate_FC",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "StartTime",
								"type": "Edm.Time",
								"precision": "0",
								"extensions": [
									{
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "StartDateTime",
								"type": "Edm.DateTimeOffset",
								"precision": "0",
								"documentation": [
									{
										"text": null,
										"extensions": [
											{
												"name": "Summary",
												"value": "Der UTC-Zeitstempel stellt Datum und Uhrzeit bezogen auf UTC  (Universal Time Coordinated) dar.",
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}, {
												"name": "LongDescription",
												"value": "Um lokale Zeiten in einen UTC-Zeitstempel zu normalisieren und somit vergleichbar zu machen, müssen diese unter Angabe ihrer Zeitzone konvertiert werden. Hierzu steht der ABAP-Befehl convert zur Verfügung.\nAuch wenn sich die dieser Umrechnung zugrundeliegende Zeitzone aus Customizing oder Stammdaten wieder ermitteln läßt, wird empfohlen, die Zeitzone redundant mit abzuspeichern.\nDie interne Struktur des UTC-Zeitstempels ist logisch untergliedert in einen Datums- und Uhrzeitteil im gepackten Ziffernformat <JJJJMMTThhmmss>. Es steht darüber hinaus auch ein hochauflösender UTC-Zeitstempel (10^-7 Sekunden) zur Verfügung.",
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}
										]
									}
								],
								"extensions": [
									{
										"name": "heading",
										"value": "Zeitstempel",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "quickinfo",
										"value": "UTC-Zeitstempel in Kurzform (JJJJMMTThhmmss)",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "Amount",
								"type": "Edm.Decimal",
								"nullable": "false",
								"precision": "11",
								"scale": "2",
								"documentation": [
									{
										"text": null,
										"extensions": [
											{
												"name": "Summary",
												"value": "Preis für externe Verarbeitung.",
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}, {
												"name": "LongDescription",
												"value": null,
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}
										]
									}
								],
								"extensions": [
									{
										"name": "unit",
										"value": "AmountCurrency",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "label",
										"value": "Preis",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "AmountCurrency",
								"type": "Edm.String",
								"nullable": "false",
								"maxLength": "5",
								"documentation": [
									{
										"text": null,
										"extensions": [
											{
												"name": "Summary",
												"value": "Schlüssel der Währung, in der die Beträge im System geführt werden.",
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}, {
												"name": "LongDescription",
												"value": null,
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}
										]
									}
								],
								"extensions": [
									{
										"name": "label",
										"value": "Währung",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "heading",
										"value": "Währg",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "quickinfo",
										"value": "Währungsschlüssel",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "semantics",
										"value": "currency-code",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "Quantity",
								"type": "Edm.Decimal",
								"nullable": "false",
								"precision": "13",
								"scale": "3",
								"documentation": [
									{
										"text": null,
										"extensions": [
											{
												"name": "Summary",
												"value": "Gesamte Menge (inklusive Ausschuß), die in diesem Auftrag gefertigt werden soll.",
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}, {
												"name": "LongDescription",
												"value": null,
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}
										]
									}
								],
								"extensions": [
									{
										"name": "unit",
										"value": "QuantityUnit",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "heading",
										"value": "Gesamte Auftragsmenge",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "quickinfo",
										"value": "Gesamte Auftragsmenge",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "QuantityUnit",
								"type": "Edm.String",
								"nullable": "false",
								"maxLength": "3",
								"documentation": [
									{
										"text": null,
										"extensions": [
											{
												"name": "Summary",
												"value": "Mengeneinheit, in der die Bestände des Materials geführt werden. In die Basismengeneinheit rechnet das System alle Mengen um, die Sie in anderen Mengeneinheiten (Alternativmengeneinheiten) erfassen.",
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}, {
												"name": "LongDescription",
												"value": "Die Basismengeneinheit sowie die Alternativmengeneinheiten mit den dazugehörigen Umrechnungsfaktoren legen Sie im Materialstammsatz fest.\nDa alle Datenfortschreibungen in der Basismengeneinheit erfolgen, ist die Eingabe, die Sie hier machen, im Hinblick auf die Umrechnung von Alternativmengeneinheiten besonders wichtig. In einer Alternativmengeinheit kann eine Menge nur dann exakt dargestellt werden, wenn die zur Verfügung stehenden Nachkommastellen zu ihrer Darstellung ausreichen. Damit dies gewährleistet ist, müssen Sie folgendes beachten:\nDie Basismengeneinheit ist die Einheit, die den höchsten notwendigen Genauigkeitsanspruch befriedigt.\nUmrechnungen der Alternativmengeneinheiten in die Basismengeneinheit sollten zu einfachen Dezimalbrüchen führen (also nicht 1/3 = 0,333...).\nBestandsführung\nIn der Bestandsführung ist die Basismengeneinheit gleichbedeutend mit der Lagermengeneinheit.\nDienstleistung\nFür Dienstleistungen gibt es eigene Mengeneinheiten, z.B.\nLeistungseinheit\nMengeneinheit auf der übergeordneten Ebene der Position. Die genauen Mengenangabe der einzelnen Leistungen stehen jeweils auf der detaillierten Ebene der Leistungszeile.\npauschal\nMengeneinheit auf der Ebene der Leistungszeile für einmalig zu erbringende Leistungen, bei denen keine genauen Mengen angegeben werden können oder sollen.",
												"attributes": [],
												"children": [],
												"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
											}
										]
									}
								],
								"extensions": [
									{
										"name": "heading",
										"value": "BME",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "quickinfo",
										"value": "Basismengeneinheit",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "semantics",
										"value": "unit-of-measure",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "Description_Required",
								"type": "Edm.Boolean",
								"nullable": "false",
								"extensions": [
									{
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "Description_ReadOnly",
								"type": "Edm.Boolean",
								"nullable": "false",
								"extensions": [
									{
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "Description_Hidden",
								"type": "Edm.Boolean",
								"nullable": "false",
								"extensions": [
									{
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "Description_FC",
								"type": "Edm.Byte",
								"nullable": "false",
								"extensions": [
									{
										"name": "creatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "updatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "StartDate_Required",
								"type": "Edm.Boolean",
								"nullable": "false",
								"extensions": [
									{
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "StartDate_ReadOnly",
								"type": "Edm.Boolean",
								"nullable": "false",
								"extensions": [
									{
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "StartDate_Hidden",
								"type": "Edm.Boolean",
								"nullable": "false",
								"extensions": [
									{
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "StartDate_FC",
								"type": "Edm.Byte",
								"nullable": "false",
								"extensions": [
									{
										"name": "creatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "updatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "EntityUpdatable_FC",
								"type": "Edm.Boolean",
								"nullable": "false",
								"extensions": [
									{
										"name": "creatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "updatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "Released",
								"type": "Edm.Boolean",
								"nullable": "false",
								"extensions": [
									{
										"name": "creatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "updatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}, {
								"name": "ReleaseActionEnabled_FC",
								"type": "Edm.Boolean",
								"nullable": "false",
								"extensions": [
									{
										"name": "creatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "updatable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "sortable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "filterable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}
						],
						"extensions": [
							{
								"name": "content-version",
								"value": "1",
								"namespace": "http://www.sap.com/Protocols/SAPData"
							}
						]
					}
				],
				"entityContainer": [
					{
						"name": "ZMEY_SRV_Entities",
						"isDefaultEntityContainer": "true",
						"entitySet": [
							{
								"name": "Project",
								"entityType": "ZMEY_SRV.Project_Type",
								"extensions": [
									{
										"name": "pageable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "addressable",
										"value": "false",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "content-version",
										"value": "1",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}, {
										"name": "updatable-path",
										"value": "EntityUpdatable_FC",
										"namespace": "http://www.sap.com/Protocols/SAPData"
									}
								]
							}
						]
					}
				]
			}
		]
	}
};
