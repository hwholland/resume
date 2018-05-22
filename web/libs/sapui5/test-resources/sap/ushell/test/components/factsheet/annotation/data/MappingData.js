// @copyright@
/**
 * @fileOverview Test data for qunit test for
 *               sap.ushell.components.factsheet.annotation.Mapping
 */

// Annotation Loader
var testAnnoUrl = "/ushell/test-resources/sap/ushell/test/components/factsheet/annotation/data/Annotation.xml";

// Metadata of SalesOrder in E17
var testMetaData = {
    "version" : "1.0",
    "dataServices" : {
        "dataServiceVersion" : "2.0",
        "schema" : [ {
            "namespace" : "CB_SALES_ORDER_SRV",
            "entityType" : [
                    {
                        "name" : "BillingDocument",
                        "key" : {
                            "propertyRef" : [ {
                                "name" : "BillingDocument"
                            } ]
                        },
                        "property" : [
                                {
                                    "name" : "BillingDocumentDescription",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Billing Document  Description",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "BillingDocumentType",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Billing Document Type",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "BillingDocumentTypeDescription",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Billing Document Type Description",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "BillingDocument",
                                    "type" : "Edm.String",
                                    "nullable" : "false",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Billing Document Number",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "BillingDocumentCategory",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Billing Category ID",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "BillingDocumentCategoryDescription",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Billing Category Description",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "PayerId",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Payer ID",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "PayerName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Payer Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "PayerAdditionalName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Payer Additional Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "PayerCity",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PayerCountry",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Country",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "BillToPartyId",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Bill-To Party ID",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "BillToPartyName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Bill-To Party Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "BillToPartyAdditionalName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Bill-To Party Additional Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "BillToPartyCity",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "BillToPartyCountry",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Country",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "BillingDocumentDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Billing Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrganization",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Organization ID",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOrganizationName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Organization Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "DistributionChannel",
                                    "type" : "Edm.String",
                                    "maxLength" : "2",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Distribution Channel ID",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "DistributionChannelName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Distribution Channel Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "Division",
                                    "type" : "Edm.String",
                                    "maxLength" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Division ID",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DivisionName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Division Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "NetValue",
                                    "type" : "Edm.Decimal",
                                    "precision" : "15",
                                    "scale" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "unit",
                                                "value" : "NetValueCurrency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Net Value",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "NetValueCurrency",
                                    "type" : "Edm.String",
                                    "maxLength" : "5",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Currency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "semantics",
                                                "value" : "currency-code",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "TaxAmount",
                                    "type" : "Edm.Decimal",
                                    "precision" : "13",
                                    "scale" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "unit",
                                                "value" : "TaxAmountCurrency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Tax Amount",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "TaxAmountCurrency",
                                    "type" : "Edm.String",
                                    "maxLength" : "5",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Currency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "semantics",
                                                "value" : "currency-code",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "IncotermsClassification",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Incoterms (Part 1)",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PaymentTerms",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Payment Terms ID",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "IncotermsClassificationDescription",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Incoterms (Part 1) Description",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "IncotermsTransferLoc",
                                    "type" : "Edm.String",
                                    "maxLength" : "28",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Incoterms (Part 2)",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PaymentTermsDescription",
                                    "type" : "Edm.String",
                                    "maxLength" : "30",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Payment Terms Description",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreationDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Created On Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreationTime",
                                    "type" : "Edm.Time",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Created On Time",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedBy",
                                    "type" : "Edm.String",
                                    "maxLength" : "12",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Created By",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByTitle",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Title",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByUserFirstName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "First Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByUserLastName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Last Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallSDProcessStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Overall Processing Status ID",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallSDProcessStatusDescription",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Overall Processing Status Description",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "AccountingPostingStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Posting Status ID",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "AccountingPostingStatusDescription",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Posting Status Description",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "DocumentCategory",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Document Category",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "AccountingDocumentNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Accounting Document Number",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CompanyCode",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Company Code",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "FiscalYear",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Fiscal Year",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                } ],
                        "extensions" : [ {
                            "name" : "content-version",
                            "value" : "1",
                            "namespace" : "http://www.sap.com/Protocols/SAPData"
                        } ]
                    },
                    {
                        "name" : "Customer",
                        "key" : {
                            "propertyRef" : [ {
                                "name" : "Customer"
                            } ]
                        },
                        "property" : [
                                {
                                    "name" : "FormOfAddress",
                                    "type" : "Edm.String",
                                    "maxLength" : "15",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Title",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CustomerName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Customer Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "Customer",
                                    "type" : "Edm.String",
                                    "nullable" : "false",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Customer Number",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "CustomerAdditionalName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Additional Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "StreetAddressName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Address",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "CityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "City",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "RegionName",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Region",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CountryName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Country",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "PostalCode",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Postal Code",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "EmailAddress",
                                    "type" : "Edm.String",
                                    "maxLength" : "241",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Email",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "MobilePhoneNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "30",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Mobile",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PhoneNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "30",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Phone",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "PhoneNumberExtension",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Phone Ext.",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "FaxNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "30",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Fax",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "FaxNumberExtension",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Fax Ext.",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "AddressID",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Address ID",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SearchTerm",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Search Term",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                } ],
                        "extensions" : [ {
                            "name" : "content-version",
                            "value" : "1",
                            "namespace" : "http://www.sap.com/Protocols/SAPData"
                        } ]
                    },
                    {
                        "name" : "OutboundDelivery",
                        "key" : {
                            "propertyRef" : [ {
                                "name" : "OutboundDelivery"
                            } ]
                        },
                        "property" : [
                                {
                                    "name" : "OutboundDelivery",
                                    "type" : "Edm.String",
                                    "nullable" : "false",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Outbound Delivery",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "DeliveryDocumentType",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Delivery Type",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "LFART_TEXT",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Delivery Type Description",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "OverallSDProcessStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Overall Processing Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "GBSTK_DESCRIPTION",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Overall Processing Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "KUNNR_WE",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Ship-to Party ID",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToParty",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sold-to Party ID",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sold-to Party Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyName2",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Additional Sold-to Party Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "KUNNR_SP",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Forwarding Agent ID",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CarrierPartyName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Forwarding Agent Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CarrierPartyName2",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Additional Forwarding Agent Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "TotalGrossWeight",
                                    "type" : "Edm.Decimal",
                                    "precision" : "15",
                                    "scale" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Total Weight",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "GEWEI_1_HEAD_MSEH3",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "External Unit of Measurement in Commercial Format (3-Char.)",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "GEWEI_1",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Weight Unit",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "TotalNetWeight",
                                    "type" : "Edm.Decimal",
                                    "precision" : "15",
                                    "scale" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Net Weight",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "GEWEI_2_HEAD_MSEH3",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Weight Unit",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "GEWEI_2",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Weight Unit",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToPartyName1",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Ship-to Party Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToPartyName2",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Additional Ship-to Party Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "HeaderVolume",
                                    "type" : "Edm.Decimal",
                                    "precision" : "15",
                                    "scale" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Volume",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "VOLEH_HEAD_MSEH3",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Volume Unit",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "HeaderVolumeUnit",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Volume Unit",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SDDocumentCategory",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Document Type",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "TransportationPlanningStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Transportation Planning Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "TRSTA_DESCRIPTION",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Transportation Planning Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallPickingStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Overall Picking Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallWarehouseActivityStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Status Warehouse Management Activities",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "KOSTK_DESCRIPTION",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Overall Picking Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "LVSTK_DESCRIPTION",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Status Warehouse Management Activities",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallPackingStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Packing Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PKSTK_DESCRIPTION",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Reference Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallGoodsMovementStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Total Goods Movement Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "WBSTK_DESCRIPTION",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Total Goods Movement Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallDelivReltdBillgStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Billing Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "FKSTK_DESCRIPTION",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Billing Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByUser",
                                    "type" : "Edm.String",
                                    "maxLength" : "12",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Created by",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "USER_NAME_CREATE",
                                    "type" : "Edm.String",
                                    "maxLength" : "80",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Created by",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreationDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Created on",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreationTime",
                                    "type" : "Edm.Time",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Creation Time",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "LastChangedByUser",
                                    "type" : "Edm.String",
                                    "maxLength" : "12",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Changed by",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "USER_NAME_CHANGE",
                                    "type" : "Edm.String",
                                    "maxLength" : "80",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Changed by",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "LastChangeDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Changed on",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShippingPoint",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Shipping Point",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "VSTEL_TEXT",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Shipping Point",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOrganization",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Organization",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "VKORG_TEXT",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Organization",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PlanedGoodsIssueDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Planned Goods Issue Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "LoadingDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Loading Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "TransportationPlanningDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Transportation Planning Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DeliveryDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Delivery Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PickingDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Picking Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ActualGoodsMovementDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Actual Goods Movement Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ANZPK",
                                    "type" : "Edm.String",
                                    "maxLength" : "5",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Number of Packages",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "INCO1",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Incoterms 1",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "INCO2",
                                    "type" : "Edm.String",
                                    "maxLength" : "28",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Incoterms 2",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "LIFEX",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "External Delivery ID",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SPE_LIFEX_TYPE",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Type of Ext. Identific.",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                } ],
                        "extensions" : [ {
                            "name" : "content-version",
                            "value" : "1",
                            "namespace" : "http://www.sap.com/Protocols/SAPData"
                        } ]
                    },
                    {
                        "name" : "SD_VBAP",
                        "key" : {
                            "propertyRef" : [ {
                                "name" : "SalesOrderItem"
                            } ]
                        },
                        "property" : [
                                {
                                    "name" : "Material",
                                    "type" : "Edm.String",
                                    "maxLength" : "18",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Material",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrder",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Order",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "OrderQuantity",
                                    "type" : "Edm.Decimal",
                                    "precision" : "15",
                                    "scale" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Order Quantity",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OrderQuantityUnit_E",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "External Unit of Measurement in Commercial Format (3-Char.)",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "NetAmount",
                                    "type" : "Edm.Decimal",
                                    "precision" : "15",
                                    "scale" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "unit",
                                                "value" : "TransactionCurrency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Net Value",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "TransactionCurrency",
                                    "type" : "Edm.String",
                                    "maxLength" : "5",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Currency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "semantics",
                                                "value" : "currency-code",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrderItem",
                                    "type" : "Edm.String",
                                    "nullable" : "false",
                                    "maxLength" : "6",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Item",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrderItemText",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Item Description",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrderItemCategory",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Item Category",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrderItemCategoryName",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Item Category",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "MaterialByCustomer",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Customer Material Number",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "MaterialName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Material Description",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "MaterialGroup",
                                    "type" : "Edm.String",
                                    "maxLength" : "9",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Material Group",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "MaterialGroupName",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Material Group",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "NetPriceAmount",
                                    "type" : "Edm.Decimal",
                                    "precision" : "11",
                                    "scale" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "unit",
                                                "value" : "WAERK_NETPR",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Net Price",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "WAERK_NETPR",
                                    "type" : "Edm.String",
                                    "maxLength" : "5",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Currency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "semantics",
                                                "value" : "currency-code",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "Plant",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Plant",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "StorageLocation",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Storage Location",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "StorageLocationName",
                                    "type" : "Edm.String",
                                    "maxLength" : "16",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Storage Location",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShippingPoint",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Shipping Point",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShippingPointName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Shipping Point",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PlantName",
                                    "type" : "Edm.String",
                                    "maxLength" : "30",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Plant",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SDProcessStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Overall Processing Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SDProcessStatusDescription",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Overall Processing Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DeliveryStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Delivery Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DeliveryStatusDesc",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Delivery Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                } ],
                        "extensions" : [
                                {
                                    "name" : "label",
                                    "value" : "Items",
                                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                                },
                                {
                                    "name" : "content-version",
                                    "value" : "1",
                                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                                } ]
                    },
                    {
                        "name" : "SalesContract",
                        "key" : {
                            "propertyRef" : [ {
                                "name" : "SalesContract"
                            } ]
                        },
                        "property" : [
                                {
                                    "name" : "VBELN_DESCR",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Document Description",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesContract",
                                    "type" : "Edm.String",
                                    "nullable" : "false",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Contract",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesContractType",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Document Type",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToParty",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sold-To Party",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SoldToPartyCityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyCountry",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Cty",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToParty",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Ship-To Party",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToPartyCityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToPartyCountry",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Cty",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPerson",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Contact Person",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonFirstName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "First Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "VBTYP",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Document Category",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonLastName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Last Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonCityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "ShipToPartyName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonPhoneNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "16",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Telephone",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToPartyAdditionalName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Name 2",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PurchaseOrderByCustomer",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Purchase Order Number",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesContractDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Document Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesContractValidityStartDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Valid From",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesContractValidityEndDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Valid To",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyAdditionalName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Name 2",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "NetAmount",
                                    "type" : "Edm.Decimal",
                                    "precision" : "15",
                                    "scale" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "unit",
                                                "value" : "NetAmountCurrency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Net Value",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrganization",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Organization",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallSDDocRefStatusDesc",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Reference Status",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOrganizationName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Organization",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "DistributionChannel",
                                    "type" : "Edm.String",
                                    "maxLength" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Distribution Channel",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DistributionChannelName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Distribution Channel",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "Division",
                                    "type" : "Edm.String",
                                    "maxLength" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Division",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DivisionName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Division",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesGroup",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Group",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesGroupName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Group",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOffice",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Office",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOfficeName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Office",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "NetAmountCurrency",
                                    "type" : "Edm.String",
                                    "maxLength" : "5",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Currency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "semantics",
                                                "value" : "currency-code",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesContractTypeName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Document Type",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "CreationDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Created On",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreationTime",
                                    "type" : "Edm.Time",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Time",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByUser",
                                    "type" : "Edm.String",
                                    "maxLength" : "12",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Created By",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "AcademicTitleName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Title",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByUserFirstName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "First Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "CreatedByUserLastName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Last Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "TransactionGroup",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Transaction Group",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallSDProcessStatusDesc",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Overall Processing Status",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "VBELN_GRP",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Group Contract",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                } ],
                        "extensions" : [ {
                            "name" : "content-version",
                            "value" : "1",
                            "namespace" : "http://www.sap.com/Protocols/SAPData"
                        } ]
                    },
                    {
                        "name" : "SalesOrder",
                        "key" : {
                            "propertyRef" : [ {
                                "name" : "SalesOrder"
                            } ]
                        },
                        "property" : [
                                {
                                    "name" : "VBELN_DESCR",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Document Description",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrderType",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Document Type",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrderTypeName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Document Type",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SoldToParty",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sold-To Party",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SoldToPartyCityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyCountry",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Country",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrder",
                                    "type" : "Edm.String",
                                    "nullable" : "false",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Order",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "PurchaseOrderByCustomer",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Purchase Order Number",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOrderDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Document Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "NetAmount",
                                    "type" : "Edm.Decimal",
                                    "precision" : "15",
                                    "scale" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "unit",
                                                "value" : "TransactionCurrency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Net Value",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyAdditionalName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Additional Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "ShipToParty",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Ship-To Party",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "ShipToPartyCityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToPartyCountry",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Cty",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPerson",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Contact Person",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonFirstName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "First Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonLastName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Last Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonCityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonPhoneNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "16",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Telephone",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToPartyName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "ShipToPartyAdditionalName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Name 2",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOrganization",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Organization",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrganizationName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Organization",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "DistributionChannel",
                                    "type" : "Edm.String",
                                    "maxLength" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Distribution Channel",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DistributionChannelName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Distribution Channel",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "Division",
                                    "type" : "Edm.String",
                                    "maxLength" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Division",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DivisionName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Division",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesGroup",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Group",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesGroupName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Group",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOffice",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Office",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOfficeName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Office",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "TransactionCurrency",
                                    "type" : "Edm.String",
                                    "maxLength" : "5",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Currency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "semantics",
                                                "value" : "currency-code",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "RequestedDeliveryDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Requested Delivery Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreationDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Created On",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreationTime",
                                    "type" : "Edm.Time",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Time",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByUser",
                                    "type" : "Edm.String",
                                    "maxLength" : "12",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Created By",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "AcademicTitleName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Title",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByUserFirstName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "First Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "CreatedByUserLastName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Last Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "TransactionGroup",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Transaction Group",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SDDocumentCategory",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Document Category",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallSDProcessStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Overall Processing Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallSDProcessStatusDesc",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Overall Processing Status",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "OverallDeliveryStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Delivery Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallDeliveryStatusDesc",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Delivery Status",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "TotalCreditCheckStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Credit Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "TotalCreditCheckStatusDesc",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Credit Status",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                } ],
                        "navigationProperty" : [
                                {
                                    "name" : "SNAV_SO_VBAP",
                                    "relationship" : "CB_SALES_ORDER_SRV.SNAV_SO_VBAP",
                                    "fromRole" : "FromRole_SNAV_SO_VBAP",
                                    "toRole" : "ToRole_SNAV_SO_VBAP"
                                },
                                {
                                    "name" : "CCUSTOMER_AG",
                                    "relationship" : "CB_SALES_ORDER_SRV.CCUSTOMER_AG",
                                    "fromRole" : "FromRole_CCUSTOMER_AG",
                                    "toRole" : "ToRole_CCUSTOMER_AG"
                                },
                                {
                                    "name" : "CCUSTOMER_WE",
                                    "relationship" : "CB_SALES_ORDER_SRV.CCUSTOMER_WE",
                                    "fromRole" : "FromRole_CCUSTOMER_WE",
                                    "toRole" : "ToRole_CCUSTOMER_WE"
                                },
                                {
                                    "name" : "CUSER_ERNAM",
                                    "relationship" : "CB_SALES_ORDER_SRV.CUSER_ERNAM",
                                    "fromRole" : "FromRole_CUSER_ERNAM",
                                    "toRole" : "ToRole_CUSER_ERNAM"
                                },
                                {
                                    "name" : "CPREVIOUS_QUOTATION",
                                    "relationship" : "CB_SALES_ORDER_SRV.CPREVIOUS_QUOTATION",
                                    "fromRole" : "FromRole_CPREVIOUS_QUOTATION",
                                    "toRole" : "ToRole_CPREVIOUS_QUOTATION"
                                },
                                {
                                    "name" : "CPREVIOUS_CONTRACT",
                                    "relationship" : "CB_SALES_ORDER_SRV.CPREVIOUS_CONTRACT",
                                    "fromRole" : "FromRole_CPREVIOUS_CONTRACT",
                                    "toRole" : "ToRole_CPREVIOUS_CONTRACT"
                                },
                                {
                                    "name" : "CSUBS_OUTBOUND_DELIVERY",
                                    "relationship" : "CB_SALES_ORDER_SRV.CSUBS_OUTBOUND_DELIVERY",
                                    "fromRole" : "FromRole_CSUBS_OUTBOUND_DELIVERY",
                                    "toRole" : "ToRole_CSUBS_OUTBOUND_DELIVERY"
                                },
                                {
                                    "name" : "CSUBS_BILLING_DOCUMENTS",
                                    "relationship" : "CB_SALES_ORDER_SRV.CSUBS_BILLING_DOCUMENTS",
                                    "fromRole" : "FromRole_CSUBS_BILLING_DOCUMENTS",
                                    "toRole" : "ToRole_CSUBS_BILLING_DOCUMENTS"
                                } ],
                        "extensions" : [ {
                            "name" : "content-version",
                            "value" : "1",
                            "namespace" : "http://www.sap.com/Protocols/SAPData"
                        } ]
                    },
                    {
                        "name" : "SalesQuotation",
                        "key" : {
                            "propertyRef" : [ {
                                "name" : "SalesQuotation"
                            } ]
                        },
                        "property" : [
                                {
                                    "name" : "VBELN_DESCR",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Document Type",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesQuotationType",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Document Type",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesQuotationTypeName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Document Type",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SoldToParty",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sold-To Party",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesQuotation",
                                    "type" : "Edm.String",
                                    "nullable" : "false",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Quotation",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SoldToPartyCityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyCountry",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Country",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SoldToPartyName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sold-To Party",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SoldToPartyAdditionalName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Name 2",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "ContactPerson",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Contact Person",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "PurchaseOrderByCustomer",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Purchase Order Number",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesQuotationDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Document Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesQuotationValdtyStartDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Valid From",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesQuotationValidityEndDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Valid To",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToParty",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Ship-To Party",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "ShipToPartyName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Ship-To Party",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "ShipToPartyAdditionalName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Name 2",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "ShipToPartyCityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ShipToPartyCountry",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Country",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonFirstName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "First Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonLastName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Last Name",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonCityName",
                                    "type" : "Edm.String",
                                    "maxLength" : "35",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "City",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ContactPersonPhoneNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "16",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Telephone",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesQuotationNetAmount",
                                    "type" : "Edm.Decimal",
                                    "precision" : "15",
                                    "scale" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "unit",
                                                "value" : "TransactionCurrency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Net Value",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrganization",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Organization",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "SalesOrganizationName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Organization",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "DistributionChannel",
                                    "type" : "Edm.String",
                                    "maxLength" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Distribution Channel",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DistributionChannelName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Distribution Channel",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "Division",
                                    "type" : "Edm.String",
                                    "maxLength" : "2",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Division",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "DivisionName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Division",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesGroup",
                                    "type" : "Edm.String",
                                    "maxLength" : "3",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Group",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesGroupName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Group",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOffice",
                                    "type" : "Edm.String",
                                    "maxLength" : "4",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Office",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SalesOfficeName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Sales Office",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "TransactionCurrency",
                                    "type" : "Edm.String",
                                    "maxLength" : "5",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Currency",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "semantics",
                                                "value" : "currency-code",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreationDate",
                                    "type" : "Edm.DateTime",
                                    "extensions" : [
                                            {
                                                "name" : "display-format",
                                                "value" : "Date",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "label",
                                                "value" : "Created On",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreationTime",
                                    "type" : "Edm.Time",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Time",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByUser",
                                    "type" : "Edm.String",
                                    "maxLength" : "12",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Created By",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "AcademicTitleName",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Title",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "CreatedByUserFirstName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "First Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "CreatedByUserLastName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Last Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "SDDocumentCategory",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Sales Document Category",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallSDProcessStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Overall Processing Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallSDProcessStatusDesc",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Overall Processing Status",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "OverallSDDocReferenceStatus",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Reference Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OverallSDDocRefStatusDesc",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Reference Status",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "OverallSDDocumentRejectionSts",
                                    "type" : "Edm.String",
                                    "maxLength" : "1",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Rejection Status",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "OvrlSDDocumentRejectionStsDesc",
                                    "type" : "Edm.String",
                                    "maxLength" : "20",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Rejection Status",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                } ],
                        "extensions" : [ {
                            "name" : "content-version",
                            "value" : "1",
                            "namespace" : "http://www.sap.com/Protocols/SAPData"
                        } ]
                    },
                    {
                        "name" : "USER_H",
                        "key" : {
                            "propertyRef" : [ {
                                "name" : "User"
                            } ]
                        },
                        "property" : [
                                {
                                    "name" : "User",
                                    "type" : "Edm.String",
                                    "nullable" : "false",
                                    "maxLength" : "12",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "User Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "AddressID",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Addr. no.",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "VALUE_TEXT",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Title",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "VALUE_TEXT1",
                                    "type" : "Edm.String",
                                    "maxLength" : "60",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Academic Title",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "FirstName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "First Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "LastName",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Last Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "PersonFullName",
                                    "type" : "Edm.String",
                                    "maxLength" : "80",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Full Name",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "NAME1",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Company",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "DEPARTMENT",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Department",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "FUNCTION",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Function",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "EmailAddress",
                                    "type" : "Edm.String",
                                    "maxLength" : "241",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "E-Mail",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "PROFESSION",
                                    "type" : "Edm.String",
                                    "maxLength" : "40",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Profession",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "InternationalPhoneNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "30",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Telephone",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "MobilePhoneNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "30",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Mobile",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "BUILDING",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Building",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "FLOOR",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Floor",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "ROOMNUMBER",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Room No.",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                },
                                {
                                    "name" : "InternationalFaxNumber",
                                    "type" : "Edm.String",
                                    "maxLength" : "30",
                                    "extensions" : [ {
                                        "name" : "label",
                                        "value" : "Fax number",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                                },
                                {
                                    "name" : "IH_MAIL",
                                    "type" : "Edm.String",
                                    "maxLength" : "10",
                                    "extensions" : [
                                            {
                                                "name" : "label",
                                                "value" : "Int. mail",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            },
                                            {
                                                "name" : "filterable",
                                                "value" : "false",
                                                "namespace" : "http://www.sap.com/Protocols/SAPData"
                                            } ]
                                } ],
                        "extensions" : [
                                {
                                    "name" : "label",
                                    "value" : "User",
                                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                                },
                                {
                                    "name" : "content-version",
                                    "value" : "1",
                                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                                } ]
                    } ],
            "association" : [ {
                "name" : "SNAV_SO_VBAP",
                "end" : [ {
                    "type" : "CB_SALES_ORDER_SRV.SalesOrder",
                    "multiplicity" : "1",
                    "role" : "FromRole_SNAV_SO_VBAP"
                }, {
                    "type" : "CB_SALES_ORDER_SRV.SD_VBAP",
                    "multiplicity" : "*",
                    "role" : "ToRole_SNAV_SO_VBAP"
                } ],
                "extensions" : [ {
                    "name" : "content-version",
                    "value" : "1",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                }, {
                    "name" : "label",
                    "value" : "Related Applications",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                } ]
            }, {
                "name" : "CCUSTOMER_AG",
                "end" : [ {
                    "type" : "CB_SALES_ORDER_SRV.SalesOrder",
                    "multiplicity" : "1",
                    "role" : "FromRole_CCUSTOMER_AG"
                }, {
                    "type" : "CB_SALES_ORDER_SRV.Customer",
                    "multiplicity" : "*",
                    "role" : "ToRole_CCUSTOMER_AG"
                } ],
                "extensions" : [ {
                    "name" : "content-version",
                    "value" : "1",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                }, {
                    "name" : "label",
                    "value" : "Related Applications",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                } ]
            }, {
                "name" : "CCUSTOMER_WE",
                "end" : [ {
                    "type" : "CB_SALES_ORDER_SRV.SalesOrder",
                    "multiplicity" : "1",
                    "role" : "FromRole_CCUSTOMER_WE"
                }, {
                    "type" : "CB_SALES_ORDER_SRV.Customer",
                    "multiplicity" : "*",
                    "role" : "ToRole_CCUSTOMER_WE"
                } ],
                "extensions" : [ {
                    "name" : "content-version",
                    "value" : "1",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                }, {
                    "name" : "label",
                    "value" : "Related Applications",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                } ]
            }, {
                "name" : "CUSER_ERNAM",
                "end" : [ {
                    "type" : "CB_SALES_ORDER_SRV.SalesOrder",
                    "multiplicity" : "1",
                    "role" : "FromRole_CUSER_ERNAM"
                }, {
                    "type" : "CB_SALES_ORDER_SRV.USER_H",
                    "multiplicity" : "*",
                    "role" : "ToRole_CUSER_ERNAM"
                } ],
                "extensions" : [ {
                    "name" : "content-version",
                    "value" : "1",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                }, {
                    "name" : "label",
                    "value" : "Related Applications",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                } ]
            }, {
                "name" : "CPREVIOUS_QUOTATION",
                "end" : [ {
                    "type" : "CB_SALES_ORDER_SRV.SalesOrder",
                    "multiplicity" : "1",
                    "role" : "FromRole_CPREVIOUS_QUOTATION"
                }, {
                    "type" : "CB_SALES_ORDER_SRV.SalesQuotation",
                    "multiplicity" : "*",
                    "role" : "ToRole_CPREVIOUS_QUOTATION"
                } ],
                "extensions" : [ {
                    "name" : "content-version",
                    "value" : "1",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                }, {
                    "name" : "label",
                    "value" : "Related Applications",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                } ]
            }, {
                "name" : "CPREVIOUS_CONTRACT",
                "end" : [ {
                    "type" : "CB_SALES_ORDER_SRV.SalesOrder",
                    "multiplicity" : "1",
                    "role" : "FromRole_CPREVIOUS_CONTRACT"
                }, {
                    "type" : "CB_SALES_ORDER_SRV.SalesContract",
                    "multiplicity" : "*",
                    "role" : "ToRole_CPREVIOUS_CONTRACT"
                } ],
                "extensions" : [ {
                    "name" : "content-version",
                    "value" : "1",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                }, {
                    "name" : "label",
                    "value" : "Related Applications",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                } ]
            }, {
                "name" : "CSUBS_OUTBOUND_DELIVERY",
                "end" : [ {
                    "type" : "CB_SALES_ORDER_SRV.SalesOrder",
                    "multiplicity" : "1",
                    "role" : "FromRole_CSUBS_OUTBOUND_DELIVERY"
                }, {
                    "type" : "CB_SALES_ORDER_SRV.OutboundDelivery",
                    "multiplicity" : "*",
                    "role" : "ToRole_CSUBS_OUTBOUND_DELIVERY"
                } ],
                "extensions" : [ {
                    "name" : "content-version",
                    "value" : "1",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                }, {
                    "name" : "label",
                    "value" : "Related Applications",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                } ]
            }, {
                "name" : "CSUBS_BILLING_DOCUMENTS",
                "end" : [ {
                    "type" : "CB_SALES_ORDER_SRV.SalesOrder",
                    "multiplicity" : "1",
                    "role" : "FromRole_CSUBS_BILLING_DOCUMENTS"
                }, {
                    "type" : "CB_SALES_ORDER_SRV.BillingDocument",
                    "multiplicity" : "*",
                    "role" : "ToRole_CSUBS_BILLING_DOCUMENTS"
                } ],
                "extensions" : [ {
                    "name" : "content-version",
                    "value" : "1",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                }, {
                    "name" : "label",
                    "value" : "Related Applications",
                    "namespace" : "http://www.sap.com/Protocols/SAPData"
                } ]
            } ],
            "entityContainer" : [ {
                "name" : "CB_SALES_ORDER_SRV",
                "isDefaultEntityContainer" : "true",
                "entitySet" : [ {
                    "name" : "Customers",
                    "entityType" : "CB_SALES_ORDER_SRV.Customer",
                    "extensions" : [ {
                        "name" : "searchable",
                        "value" : "true",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    }, {
                        "name" : "content-version",
                        "value" : "1",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    } ]
                }, {
                    "name" : "OutboundDeliverys",
                    "entityType" : "CB_SALES_ORDER_SRV.OutboundDelivery",
                    "extensions" : [ {
                        "name" : "searchable",
                        "value" : "true",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    }, {
                        "name" : "content-version",
                        "value" : "1",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    } ]
                }, {
                    "name" : "SD_VBAPs",
                    "entityType" : "CB_SALES_ORDER_SRV.SD_VBAP",
                    "extensions" : [ {
                        "name" : "searchable",
                        "value" : "true",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    }, {
                        "name" : "content-version",
                        "value" : "1",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    } ]
                }, {
                    "name" : "SalesContracts",
                    "entityType" : "CB_SALES_ORDER_SRV.SalesContract",
                    "extensions" : [ {
                        "name" : "searchable",
                        "value" : "true",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    }, {
                        "name" : "content-version",
                        "value" : "1",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    } ]
                }, {
                    "name" : "SalesOrders",
                    "entityType" : "CB_SALES_ORDER_SRV.SalesOrder",
                    "extensions" : [ {
                        "name" : "searchable",
                        "value" : "true",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    }, {
                        "name" : "content-version",
                        "value" : "1",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    } ]
                }, {
                    "name" : "SalesQuotations",
                    "entityType" : "CB_SALES_ORDER_SRV.SalesQuotation",
                    "extensions" : [ {
                        "name" : "searchable",
                        "value" : "true",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    }, {
                        "name" : "content-version",
                        "value" : "1",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    } ]
                }, {
                    "name" : "USER_Hs",
                    "entityType" : "CB_SALES_ORDER_SRV.USER_H",
                    "extensions" : [ {
                        "name" : "searchable",
                        "value" : "true",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    }, {
                        "name" : "content-version",
                        "value" : "1",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    } ]
                }, {
                    "name" : "BillingDocuments",
                    "entityType" : "CB_SALES_ORDER_SRV.BillingDocument",
                    "extensions" : [ {
                        "name" : "searchable",
                        "value" : "true",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    }, {
                        "name" : "content-version",
                        "value" : "1",
                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                    } ]
                } ],
                "associationSet" : [
                        {
                            "name" : "CSUBS_BILLING_DOCUMENTS_AssocSet",
                            "association" : "CB_SALES_ORDER_SRV.CSUBS_BILLING_DOCUMENTS",
                            "end" : [ {
                                "entitySet" : "SalesOrders",
                                "role" : "FromRole_CSUBS_BILLING_DOCUMENTS"
                            }, {
                                "entitySet" : "BillingDocuments",
                                "role" : "ToRole_CSUBS_BILLING_DOCUMENTS"
                            } ],
                            "extensions" : [
                                    {
                                        "name" : "creatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "updatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "deletable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "content-version",
                                        "value" : "1",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                        },
                        {
                            "name" : "SNAV_SO_VBAP_AssocSet",
                            "association" : "CB_SALES_ORDER_SRV.SNAV_SO_VBAP",
                            "end" : [ {
                                "entitySet" : "SalesOrders",
                                "role" : "FromRole_SNAV_SO_VBAP"
                            }, {
                                "entitySet" : "SD_VBAPs",
                                "role" : "ToRole_SNAV_SO_VBAP"
                            } ],
                            "extensions" : [
                                    {
                                        "name" : "creatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "updatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "deletable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "content-version",
                                        "value" : "1",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                        },
                        {
                            "name" : "CCUSTOMER_WE_AssocSet",
                            "association" : "CB_SALES_ORDER_SRV.CCUSTOMER_WE",
                            "end" : [ {
                                "entitySet" : "SalesOrders",
                                "role" : "FromRole_CCUSTOMER_WE"
                            }, {
                                "entitySet" : "Customers",
                                "role" : "ToRole_CCUSTOMER_WE"
                            } ],
                            "extensions" : [
                                    {
                                        "name" : "creatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "updatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "deletable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "content-version",
                                        "value" : "1",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                        },
                        {
                            "name" : "CPREVIOUS_QUOTATION_AssocSet",
                            "association" : "CB_SALES_ORDER_SRV.CPREVIOUS_QUOTATION",
                            "end" : [ {
                                "entitySet" : "SalesOrders",
                                "role" : "FromRole_CPREVIOUS_QUOTATION"
                            }, {
                                "entitySet" : "SalesQuotations",
                                "role" : "ToRole_CPREVIOUS_QUOTATION"
                            } ],
                            "extensions" : [
                                    {
                                        "name" : "creatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "updatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "deletable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "content-version",
                                        "value" : "1",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                        },
                        {
                            "name" : "CPREVIOUS_CONTRACT_AssocSet",
                            "association" : "CB_SALES_ORDER_SRV.CPREVIOUS_CONTRACT",
                            "end" : [ {
                                "entitySet" : "SalesOrders",
                                "role" : "FromRole_CPREVIOUS_CONTRACT"
                            }, {
                                "entitySet" : "SalesContracts",
                                "role" : "ToRole_CPREVIOUS_CONTRACT"
                            } ],
                            "extensions" : [
                                    {
                                        "name" : "creatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "updatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "deletable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "content-version",
                                        "value" : "1",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                        },
                        {
                            "name" : "CCUSTOMER_AG_AssocSet",
                            "association" : "CB_SALES_ORDER_SRV.CCUSTOMER_AG",
                            "end" : [ {
                                "entitySet" : "SalesOrders",
                                "role" : "FromRole_CCUSTOMER_AG"
                            }, {
                                "entitySet" : "Customers",
                                "role" : "ToRole_CCUSTOMER_AG"
                            } ],
                            "extensions" : [
                                    {
                                        "name" : "creatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "updatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "deletable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "content-version",
                                        "value" : "1",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                        },
                        {
                            "name" : "CSUBS_OUTBOUND_DELIVERY_AssocSet",
                            "association" : "CB_SALES_ORDER_SRV.CSUBS_OUTBOUND_DELIVERY",
                            "end" : [ {
                                "entitySet" : "SalesOrders",
                                "role" : "FromRole_CSUBS_OUTBOUND_DELIVERY"
                            }, {
                                "entitySet" : "OutboundDeliverys",
                                "role" : "ToRole_CSUBS_OUTBOUND_DELIVERY"
                            } ],
                            "extensions" : [
                                    {
                                        "name" : "creatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "updatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "deletable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "content-version",
                                        "value" : "1",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                        },
                        {
                            "name" : "CUSER_ERNAM_AssocSet",
                            "association" : "CB_SALES_ORDER_SRV.CUSER_ERNAM",
                            "end" : [ {
                                "entitySet" : "SalesOrders",
                                "role" : "FromRole_CUSER_ERNAM"
                            }, {
                                "entitySet" : "USER_Hs",
                                "role" : "ToRole_CUSER_ERNAM"
                            } ],
                            "extensions" : [
                                    {
                                        "name" : "creatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "updatable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "deletable",
                                        "value" : "false",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    },
                                    {
                                        "name" : "content-version",
                                        "value" : "1",
                                        "namespace" : "http://www.sap.com/Protocols/SAPData"
                                    } ]
                        } ]
            } ],
            "extensions" : [
                    {
                        "name" : "lang",
                        "value" : "en",
                        "namespace" : "http://www.w3.org/XML/1998/namespace"
                    },
                    {
                        "name" : "link",
                        "value" : null,
                        "attributes" : [
                                {
                                    "name" : "rel",
                                    "value" : "self",
                                    "namespace" : null
                                },
                                {
                                    "name" : "href",
                                    "value" : "https://your.host:port/e17-003/sap/opu/odata/sap/CB_SALES_ORDER_SRV/$metadata",
                                    "namespace" : null
                                } ],
                        "children" : [],
                        "namespace" : "http://www.w3.org/2005/Atom"
                    },
                    {
                        "name" : "link",
                        "value" : null,
                        "attributes" : [
                                {
                                    "name" : "rel",
                                    "value" : "latest-version",
                                    "namespace" : null
                                },
                                {
                                    "name" : "href",
                                    "value" : "https://your.host:port/sap/opu/odata/sap/CB_SALES_ORDER_SRV/$metadata",
                                    "namespace" : null
                                } ],
                        "children" : [],
                        "namespace" : "http://www.w3.org/2005/Atom"
                    } ]
        } ]
    }
};

// Test data of existing Mapping.js
var testResultData = {
    "annotationReferences" : {
        "CB_CUSTOMER_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDMD/cb_customer_anno.xml",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDMD/cb_customer_anno.xml",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDMD/cb_customer_anno.xml"
        },
        "CB_SALES_QUOTATION_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_QUOTATION_SRV_anno.xml",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_QUOTATION_SRV_anno.xml",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_QUOTATION_SRV_anno.xml"
        },
        "CB_SALES_CONTRACT_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_CONTRACT_SRV_anno.xml",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_CONTRACT_SRV_anno.xml",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_CONTRACT_SRV_anno.xml"
        },
        "CB_OUTBOUND_DELIVERY_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CBESH_UI_ANF_LE/CB_OUTBOUND_DELIVERY_SRV_ANNO.xml",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CBESH_UI_ANF_LE/CB_OUTBOUND_DELIVERY_SRV_ANNO.xml",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CBESH_UI_ANF_LE/CB_OUTBOUND_DELIVERY_SRV_ANNO.xml"
        },
        "CB_BILLING_DOCUMENT_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDBIL/CB_BILLING_DOCUMENT_SRV_ANNO.XML",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDBIL/CB_BILLING_DOCUMENT_SRV_ANNO.XML",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDBIL/CB_BILLING_DOCUMENT_SRV_ANNO.XML"
        }
    },
    "aliasDefinitions" : {
        "UI" : "com.sap.vocabularies.UI.v1",
        "vCard" : "com.sap.vocabularies.Communication.v1",
        "CQP" : "Org.OData.Measures.V1",
        "Common" : "com.sap.vocabularies.Common.v1",
        "CB_SALES_ORDER_SRV" : "CB_SALES_ORDER_SRV",
        "CB_CUSTOMER_SRV" : "CB_CUSTOMER_SRV",
        "CB_SALES_QUOTATION_SRV" : "CB_SALES_QUOTATION_SRV",
        "CB_SALES_CONTRACT_SRV" : "CB_SALES_CONTRACT_SRV",
        "CB_OUTBOUND_DELIVERY_SRV" : "CB_OUTBOUND_DELIVERY_SRV",
        "CB_BILLING_DOCUMENT_SRV" : "CB_BILLING_DOCUMENT_SRV"
    },
    "termDefinitions" : {
        "@CB_SALES_ORDER_SRVAnnotation.Customer" : "CB_CUSTOMER_SRV.Customer",
        "@CB_SALES_ORDER_SRVAnnotation.SalesQuotation" : "CB_SALES_QUOTATION_SRV.SalesQuotation",
        "@CB_SALES_ORDER_SRVAnnotation.SalesContract" : "CB_SALES_CONTRACT_SRV.SalesContract",
        "@CB_SALES_ORDER_SRVAnnotation.OutboundDelivery" : "CB_OUTBOUND_DELIVERY_SRV.OutboundDelivery",
        "@CB_SALES_ORDER_SRVAnnotation.BillingDocument" : "CB_BILLING_DOCUMENT_SRV.BillingDocument"
    },
    "propertyExtensions" : {
        "CB_SALES_ORDER_SRV.BillingDocument" : {
            "BillingDocumentDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Document  Description",
                    "filterable" : "false"
                }
            },
            "BillingDocumentType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Document Type",
                    "filterable" : "false"
                }
            },
            "BillingDocumentTypeDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Document Type Description"
                }
            },
            "BillingDocument" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Document Number"
                }
            },
            "BillingDocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Category ID",
                    "filterable" : "false"
                }
            },
            "BillingDocumentCategoryDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Category Description"
                }
            },
            "PayerId" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payer ID"
                }
            },
            "PayerName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payer Name"
                }
            },
            "PayerAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payer Additional Name"
                }
            },
            "PayerCity" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "PayerCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "BillToPartyId" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Bill-To Party ID"
                }
            },
            "BillToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Bill-To Party Name"
                }
            },
            "BillToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Bill-To Party Additional Name"
                }
            },
            "BillToPartyCity" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "BillToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "BillingDocumentDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Date"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization ID"
                }
            },
            "SalesOrganizationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization Name"
                }
            },
            "DistributionChannel" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel ID"
                }
            },
            "DistributionChannelName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel Name"
                }
            },
            "Division" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division ID",
                    "filterable" : "false"
                }
            },
            "DivisionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division Name"
                }
            },
            "NetValue" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "NetValueCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "NetValueCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "TaxAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "TaxAmountCurrency",
                    "label" : "Tax Amount",
                    "filterable" : "false"
                }
            },
            "TaxAmountCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "IncotermsClassification" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms (Part 1)",
                    "filterable" : "false"
                }
            },
            "PaymentTerms" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payment Terms ID",
                    "filterable" : "false"
                }
            },
            "IncotermsClassificationDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms (Part 1) Description",
                    "filterable" : "false"
                }
            },
            "IncotermsTransferLoc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms (Part 2)",
                    "filterable" : "false"
                }
            },
            "PaymentTermsDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payment Terms Description",
                    "filterable" : "false"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On Date",
                    "filterable" : "false"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On Time",
                    "filterable" : "false"
                }
            },
            "CreatedBy" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created By",
                    "filterable" : "false"
                }
            },
            "CreatedByTitle" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CreatedByUserFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name",
                    "filterable" : "false"
                }
            },
            "CreatedByUserLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status ID",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatusDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status Description"
                }
            },
            "AccountingPostingStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Posting Status ID",
                    "filterable" : "false"
                }
            },
            "AccountingPostingStatusDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Posting Status Description"
                }
            },
            "DocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Category",
                    "filterable" : "false"
                }
            },
            "AccountingDocumentNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Accounting Document Number",
                    "filterable" : "false"
                }
            },
            "CompanyCode" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Company Code",
                    "filterable" : "false"
                }
            },
            "FiscalYear" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Fiscal Year",
                    "filterable" : "false"
                }
            }
        },
        "CB_SALES_ORDER_SRV.Customer" : {
            "FormOfAddress" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CustomerName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Customer Name"
                }
            },
            "Customer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Customer Number"
                }
            },
            "CustomerAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Name"
                }
            },
            "StreetAddressName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Address"
                }
            },
            "CityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City"
                }
            },
            "RegionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Region",
                    "filterable" : "false"
                }
            },
            "CountryName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country"
                }
            },
            "PostalCode" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Postal Code"
                }
            },
            "EmailAddress" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Email"
                }
            },
            "MobilePhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Mobile",
                    "filterable" : "false"
                }
            },
            "PhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Phone"
                }
            },
            "PhoneNumberExtension" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Phone Ext.",
                    "filterable" : "false"
                }
            },
            "FaxNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Fax",
                    "filterable" : "false"
                }
            },
            "FaxNumberExtension" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Fax Ext.",
                    "filterable" : "false"
                }
            },
            "AddressID" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Address ID",
                    "filterable" : "false"
                }
            },
            "SearchTerm" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Search Term"
                }
            }
        },
        "CB_SALES_ORDER_SRV.OutboundDelivery" : {
            "OutboundDelivery" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Outbound Delivery"
                }
            },
            "DeliveryDocumentType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Type",
                    "filterable" : "false"
                }
            },
            "LFART_TEXT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Type Description"
                }
            },
            "OverallSDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "GBSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "KUNNR_WE" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-to Party ID",
                    "filterable" : "false"
                }
            },
            "SoldToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-to Party ID",
                    "filterable" : "false"
                }
            },
            "SoldToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-to Party Name",
                    "filterable" : "false"
                }
            },
            "SoldToPartyName2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Sold-to Party Name",
                    "filterable" : "false"
                }
            },
            "KUNNR_SP" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Forwarding Agent ID",
                    "filterable" : "false"
                }
            },
            "CarrierPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Forwarding Agent Name",
                    "filterable" : "false"
                }
            },
            "CarrierPartyName2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Forwarding Agent Name",
                    "filterable" : "false"
                }
            },
            "TotalGrossWeight" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Total Weight",
                    "filterable" : "false"
                }
            },
            "GEWEI_1_HEAD_MSEH3" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "External Unit of Measurement in Commercial Format (3-Char.)",
                    "filterable" : "false"
                }
            },
            "GEWEI_1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Weight Unit",
                    "filterable" : "false"
                }
            },
            "TotalNetWeight" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Net Weight",
                    "filterable" : "false"
                }
            },
            "GEWEI_2_HEAD_MSEH3" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Weight Unit",
                    "filterable" : "false"
                }
            },
            "GEWEI_2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Weight Unit",
                    "filterable" : "false"
                }
            },
            "ShipToPartyName1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-to Party Name",
                    "filterable" : "false"
                }
            },
            "ShipToPartyName2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Ship-to Party Name",
                    "filterable" : "false"
                }
            },
            "HeaderVolume" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Volume",
                    "filterable" : "false"
                }
            },
            "VOLEH_HEAD_MSEH3" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Volume Unit",
                    "filterable" : "false"
                }
            },
            "HeaderVolumeUnit" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Volume Unit",
                    "filterable" : "false"
                }
            },
            "SDDocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Type",
                    "filterable" : "false"
                }
            },
            "TransportationPlanningStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transportation Planning Status",
                    "filterable" : "false"
                }
            },
            "TRSTA_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transportation Planning Status",
                    "filterable" : "false"
                }
            },
            "OverallPickingStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Picking Status",
                    "filterable" : "false"
                }
            },
            "OverallWarehouseActivityStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Status Warehouse Management Activities",
                    "filterable" : "false"
                }
            },
            "KOSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Picking Status",
                    "filterable" : "false"
                }
            },
            "LVSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Status Warehouse Management Activities",
                    "filterable" : "false"
                }
            },
            "OverallPackingStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Packing Status",
                    "filterable" : "false"
                }
            },
            "PKSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Reference Status",
                    "filterable" : "false"
                }
            },
            "OverallGoodsMovementStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Total Goods Movement Status",
                    "filterable" : "false"
                }
            },
            "WBSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Total Goods Movement Status",
                    "filterable" : "false"
                }
            },
            "OverallDelivReltdBillgStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Status",
                    "filterable" : "false"
                }
            },
            "FKSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Status",
                    "filterable" : "false"
                }
            },
            "CreatedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created by"
                }
            },
            "USER_NAME_CREATE" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created by",
                    "filterable" : "false"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created on"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Creation Time",
                    "filterable" : "false"
                }
            },
            "LastChangedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Changed by",
                    "filterable" : "false"
                }
            },
            "USER_NAME_CHANGE" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Changed by",
                    "filterable" : "false"
                }
            },
            "LastChangeDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Changed on",
                    "filterable" : "false"
                }
            },
            "ShippingPoint" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Shipping Point"
                }
            },
            "VSTEL_TEXT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Shipping Point"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "VKORG_TEXT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "PlanedGoodsIssueDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Planned Goods Issue Date"
                }
            },
            "LoadingDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Loading Date"
                }
            },
            "TransportationPlanningDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transportation Planning Date"
                }
            },
            "DeliveryDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Date"
                }
            },
            "PickingDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Picking Date"
                }
            },
            "ActualGoodsMovementDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Actual Goods Movement Date",
                    "filterable" : "false"
                }
            },
            "ANZPK" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Number of Packages",
                    "filterable" : "false"
                }
            },
            "INCO1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms 1",
                    "filterable" : "false"
                }
            },
            "INCO2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms 2",
                    "filterable" : "false"
                }
            },
            "LIFEX" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "External Delivery ID"
                }
            },
            "SPE_LIFEX_TYPE" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Type of Ext. Identific.",
                    "filterable" : "false"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SD_VBAP" : {
            "Material" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Material",
                    "filterable" : "false"
                }
            },
            "SalesOrder" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Order"
                }
            },
            "OrderQuantity" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Order Quantity",
                    "filterable" : "false"
                }
            },
            "OrderQuantityUnit_E" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "External Unit of Measurement in Commercial Format (3-Char.)",
                    "filterable" : "false"
                }
            },
            "NetAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "TransactionCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "TransactionCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "SalesOrderItem" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Item",
                    "filterable" : "false"
                }
            },
            "SalesOrderItemText" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Item Description",
                    "filterable" : "false"
                }
            },
            "SalesOrderItemCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Item Category",
                    "filterable" : "false"
                }
            },
            "SalesOrderItemCategoryName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Item Category",
                    "filterable" : "false"
                }
            },
            "MaterialByCustomer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Customer Material Number",
                    "filterable" : "false"
                }
            },
            "MaterialName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Material Description",
                    "filterable" : "false"
                }
            },
            "MaterialGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Material Group",
                    "filterable" : "false"
                }
            },
            "MaterialGroupName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Material Group",
                    "filterable" : "false"
                }
            },
            "NetPriceAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "WAERK_NETPR",
                    "label" : "Net Price",
                    "filterable" : "false"
                }
            },
            "WAERK_NETPR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "Plant" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Plant",
                    "filterable" : "false"
                }
            },
            "StorageLocation" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Storage Location",
                    "filterable" : "false"
                }
            },
            "StorageLocationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Storage Location",
                    "filterable" : "false"
                }
            },
            "ShippingPoint" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Shipping Point",
                    "filterable" : "false"
                }
            },
            "ShippingPointName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Shipping Point",
                    "filterable" : "false"
                }
            },
            "PlantName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Plant",
                    "filterable" : "false"
                }
            },
            "SDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "SDProcessStatusDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "DeliveryStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Status",
                    "filterable" : "false"
                }
            },
            "DeliveryStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Status",
                    "filterable" : "false"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesContract" : {
            "VBELN_DESCR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Description",
                    "filterable" : "false"
                }
            },
            "SalesContract" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Contract"
                }
            },
            "SalesContractType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type",
                    "filterable" : "false"
                }
            },
            "SoldToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-To Party"
                }
            },
            "SoldToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "SoldToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Cty",
                    "filterable" : "false"
                }
            },
            "ShipToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-To Party",
                    "filterable" : "false"
                }
            },
            "ShipToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ShipToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Cty",
                    "filterable" : "false"
                }
            },
            "ContactPerson" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Contact Person",
                    "filterable" : "false"
                }
            },
            "ContactPersonFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name",
                    "filterable" : "false"
                }
            },
            "VBTYP" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Category",
                    "filterable" : "false"
                }
            },
            "ContactPersonLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "SoldToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name"
                }
            },
            "ShipToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonPhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Telephone",
                    "filterable" : "false"
                }
            },
            "ShipToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2",
                    "filterable" : "false"
                }
            },
            "PurchaseOrderByCustomer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Purchase Order Number"
                }
            },
            "SalesContractDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Date"
                }
            },
            "SalesContractValidityStartDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Valid From"
                }
            },
            "SalesContractValidityEndDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Valid To"
                }
            },
            "SoldToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2"
                }
            },
            "NetAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "NetAmountCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "OverallSDDocRefStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Reference Status"
                }
            },
            "SalesOrganizationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization"
                }
            },
            "DistributionChannel" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel",
                    "filterable" : "false"
                }
            },
            "DistributionChannelName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel"
                }
            },
            "Division" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division",
                    "filterable" : "false"
                }
            },
            "DivisionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division"
                }
            },
            "SalesGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group",
                    "filterable" : "false"
                }
            },
            "SalesGroupName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesOffice" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office",
                    "filterable" : "false"
                }
            },
            "SalesOfficeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "NetAmountCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "SalesContractTypeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On",
                    "filterable" : "false"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Time",
                    "filterable" : "false"
                }
            },
            "CreatedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created By"
                }
            },
            "AcademicTitleName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CreatedByUserFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name"
                }
            },
            "CreatedByUserLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name"
                }
            },
            "TransactionGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transaction Group",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status"
                }
            },
            "VBELN_GRP" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Group Contract"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesOrder" : {
            "VBELN_DESCR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Description",
                    "filterable" : "false"
                }
            },
            "SalesOrderType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type",
                    "filterable" : "false"
                }
            },
            "SalesOrderTypeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type"
                }
            },
            "SoldToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-To Party"
                }
            },
            "SoldToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "SoldToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "SalesOrder" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Order"
                }
            },
            "PurchaseOrderByCustomer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Purchase Order Number"
                }
            },
            "SalesOrderDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Date"
                }
            },
            "SoldToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name"
                }
            },
            "NetAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "TransactionCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "SoldToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Name"
                }
            },
            "ShipToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-To Party"
                }
            },
            "ShipToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ShipToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Cty",
                    "filterable" : "false"
                }
            },
            "ContactPerson" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Contact Person",
                    "filterable" : "false"
                }
            },
            "ContactPersonFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ContactPersonPhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Telephone",
                    "filterable" : "false"
                }
            },
            "ShipToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name"
                }
            },
            "ShipToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "SalesOrganizationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization"
                }
            },
            "DistributionChannel" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel",
                    "filterable" : "false"
                }
            },
            "DistributionChannelName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel"
                }
            },
            "Division" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division",
                    "filterable" : "false"
                }
            },
            "DivisionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division"
                }
            },
            "SalesGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesGroupName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesOffice" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "SalesOfficeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "TransactionCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "RequestedDeliveryDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Requested Delivery Date"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Time",
                    "filterable" : "false"
                }
            },
            "CreatedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created By"
                }
            },
            "AcademicTitleName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CreatedByUserFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name"
                }
            },
            "CreatedByUserLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name"
                }
            },
            "TransactionGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transaction Group",
                    "filterable" : "false"
                }
            },
            "SDDocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Category",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status"
                }
            },
            "OverallDeliveryStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Status",
                    "filterable" : "false"
                }
            },
            "OverallDeliveryStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Status"
                }
            },
            "TotalCreditCheckStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Credit Status",
                    "filterable" : "false"
                }
            },
            "TotalCreditCheckStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Credit Status"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesQuotation" : {
            "VBELN_DESCR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type",
                    "filterable" : "false"
                }
            },
            "SalesQuotationType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type",
                    "filterable" : "false"
                }
            },
            "SalesQuotationTypeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type"
                }
            },
            "SoldToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-To Party"
                }
            },
            "SalesQuotation" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Quotation"
                }
            },
            "SoldToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "SoldToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "SoldToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-To Party"
                }
            },
            "SoldToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2"
                }
            },
            "ContactPerson" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Contact Person",
                    "filterable" : "false"
                }
            },
            "PurchaseOrderByCustomer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Purchase Order Number"
                }
            },
            "SalesQuotationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Date"
                }
            },
            "SalesQuotationValdtyStartDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Valid From"
                }
            },
            "SalesQuotationValidityEndDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Valid To"
                }
            },
            "ShipToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-To Party"
                }
            },
            "ShipToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-To Party"
                }
            },
            "ShipToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2"
                }
            },
            "ShipToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ShipToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "ContactPersonFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ContactPersonPhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Telephone",
                    "filterable" : "false"
                }
            },
            "SalesQuotationNetAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "TransactionCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "SalesOrganizationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization"
                }
            },
            "DistributionChannel" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel",
                    "filterable" : "false"
                }
            },
            "DistributionChannelName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel"
                }
            },
            "Division" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division",
                    "filterable" : "false"
                }
            },
            "DivisionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division"
                }
            },
            "SalesGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesGroupName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesOffice" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "SalesOfficeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "TransactionCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On",
                    "filterable" : "false"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Time",
                    "filterable" : "false"
                }
            },
            "CreatedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created By"
                }
            },
            "AcademicTitleName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CreatedByUserFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name"
                }
            },
            "CreatedByUserLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name"
                }
            },
            "SDDocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Category",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status"
                }
            },
            "OverallSDDocReferenceStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Reference Status",
                    "filterable" : "false"
                }
            },
            "OverallSDDocRefStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Reference Status"
                }
            },
            "OverallSDDocumentRejectionSts" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Rejection Status",
                    "filterable" : "false"
                }
            },
            "OvrlSDDocumentRejectionStsDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Rejection Status"
                }
            }
        },
        "CB_SALES_ORDER_SRV.USER_H" : {
            "User" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "User Name"
                }
            },
            "AddressID" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Addr. no."
                }
            },
            "VALUE_TEXT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title"
                }
            },
            "VALUE_TEXT1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Academic Title"
                }
            },
            "FirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name"
                }
            },
            "LastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name"
                }
            },
            "PersonFullName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Full Name"
                }
            },
            "NAME1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Company"
                }
            },
            "DEPARTMENT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Department",
                    "filterable" : "false"
                }
            },
            "FUNCTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Function",
                    "filterable" : "false"
                }
            },
            "EmailAddress" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "E-Mail"
                }
            },
            "PROFESSION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Profession"
                }
            },
            "InternationalPhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Telephone"
                }
            },
            "MobilePhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Mobile"
                }
            },
            "BUILDING" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Building",
                    "filterable" : "false"
                }
            },
            "FLOOR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Floor",
                    "filterable" : "false"
                }
            },
            "ROOMNUMBER" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Room No.",
                    "filterable" : "false"
                }
            },
            "InternationalFaxNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Fax number"
                }
            },
            "IH_MAIL" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Int. mail",
                    "filterable" : "false"
                }
            }
        }
    },
    "CB_SALES_ORDER_SRV.SalesOrder" : {
        "CB_SALES_ORDER_SRVAnnotation.Customer" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Customer-displayFactSheet?Customer={ID1}"
                    }, {
                        "Name" : "ID1",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "ShipToParty"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "CB_SALES_ORDER_SRVAnnotation.Customer1" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Customer-displayFactSheet?Customer={ID0}"
                    }, {
                        "Name" : "ID0",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "SoldToParty"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : ""
            },
            "TypeNamePlural" : {
                "String" : ""
            },
            "Title" : {
                "Value" : {
                    "Path" : "VBELN_DESCR"
                },
                "EdmType" : "Edm.String"
            },
            "Description" : {
                "Value" : {
                    "Path" : "SalesOrder"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : ""
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Value" : {
                    "Path" : "VBELN_DESCR"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            },
            "MainInfo" : {
                "Value" : {
                    "Path" : "SalesOrder"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "SalesOrderType"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.Customer1"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "SoldToParty",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    }, {
                        "Type" : "Path",
                        "Value" : "SoldToPartyName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ", "
                    }, {
                        "Type" : "Path",
                        "Value" : "SoldToPartyAdditionalName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ", "
                    }, {
                        "Type" : "Path",
                        "Value" : "SoldToPartyCityName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ", "
                    }, {
                        "Type" : "Path",
                        "Value" : "SoldToPartyCountry",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.Customer"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "ShipToParty",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    }, {
                        "Type" : "Path",
                        "Value" : "ShipToPartyName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ", "
                    }, {
                        "Type" : "Path",
                        "Value" : "ShipToPartyAdditionalName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ", "
                    }, {
                        "Type" : "Path",
                        "Value" : "ShipToPartyCityName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ",  ("
                    }, {
                        "Type" : "Path",
                        "Value" : "ShipToPartyCountry",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ") "
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesOrderDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "PurchaseOrderByCustomer"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "NetAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "RequestedDeliveryDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        } ],
        "com.sap.vocabularies.UI.v1.FieldGroup#Detail2" : {
            "Label" : {
                "String" : ""
            },
            "Data" : [ {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "SalesOrganization",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " - "
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesOrganizationName",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "DistributionChannel",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " - "
                        }, {
                            "Type" : "Path",
                            "Value" : "DistributionChannelName",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "Division",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " - "
                        }, {
                            "Type" : "Path",
                            "Value" : "DivisionName",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " % "
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "SalesGroup",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " - "
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesGroupName",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "SalesOffice",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " - "
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesOfficeName",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            } ]
        },
        "com.sap.vocabularies.UI.v1.FieldGroup#Detail3" : {
            "Label" : {
                "String" : ""
            },
            "Data" : [ {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "CreationDate",
                            "EdmType" : "Edm.Date"
                        }, {
                            "Type" : "String",
                            "Value" : ", "
                        }, {
                            "Type" : "Path",
                            "Value" : "CreationTime",
                            "EdmType" : "Edm.Time"
                        }, {
                            "Type" : "String",
                            "Value" : " / "
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "CreatedByUser",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " - "
                        }, {
                            "Type" : "Path",
                            "Value" : "AcademicTitleName",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " "
                        }, {
                            "Type" : "Path",
                            "Value" : "CreatedByUserLastName",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " = "
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            } ]
        },
        "com.sap.vocabularies.UI.v1.FieldGroup#Detail4" : {
            "Label" : {
                "String" : ""
            },
            "Data" : [ {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
                },
                "Value" : {
                    "Path" : "OverallDeliveryStatusDesc"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
                },
                "Value" : {
                    "Path" : "TotalCreditCheckStatusDesc"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            } ]
        },
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "Value" : {
                "Path" : "TotalCreditCheckStatusDesc"
            },
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "SalesOrder"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "VBELN_DESCR"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [
                {
                    "com.sap.vocabularies.UI.v1.IsSummary" : {},
                    "Label" : {},
                    "Facets" : [
                            {
                                "Label" : {
                                    "String" : "Column B                                                                                                                                                                                                                                                       "
                                },
                                "Target" : {
                                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                                },
                                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                            },
                            {
                                "Label" : {
                                    "String" : ""
                                },
                                "Target" : {
                                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.FieldGroup#Detail2"
                                },
                                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                            },
                            {
                                "Label" : {
                                    "String" : ""
                                },
                                "Target" : {
                                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.FieldGroup#Detail3"
                                },
                                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                            },
                            {
                                "Label" : {
                                    "String" : ""
                                },
                                "Target" : {
                                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.FieldGroup#Detail4"
                                },
                                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                            } ],
                    "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "SNAV_SO_VBAP/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "CPREVIOUS_QUOTATION/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "CPREVIOUS_CONTRACT/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "CSUBS_OUTBOUND_DELIVERY/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "CSUBS_BILLING_DOCUMENTS/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                } ],
        "com.sap.vocabularies.UI.v1.DataPoint#01" : {
            "Title" : {
                "String" : ""
            },
            "Value" : {
                "Path" : "NetAmount",
                "EdmType" : "Edm.Decimal"
            }
        },
        "com.sap.vocabularies.UI.v1.DataPoint#02" : {
            "Title" : {
                "String" : ""
            },
            "Value" : {
                "Path" : "OverallSDProcessStatusDesc",
                "EdmType" : "Edm.String"
            }
        }
    },
    "propertyAnnotations" : {
        "CB_SALES_ORDER_SRV.SalesOrder" : {
            "NetAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "TransactionCurrency"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SD_VBAP" : {
            "NetAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "TransactionCurrency"
                }
            },
            "NetPriceAmount" : {
                "Org.OData.Measures.V1.ISOCurrency" : {
                    "Path" : "WAERK_NETPR"
                }
            },
            "OrderQuantity" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "OrderQuantityUnit_E"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesQuotation" : {
            "SalesQuotationNetAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "TransactionCurrency"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesContract" : {
            "NetAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "NetAmountCurrency"
                }
            }
        },
        "CB_SALES_ORDER_SRV.BillingDocument" : {
            "NetValue" : {
                "Org.OData.Measures.V1.ISOCurrency" : {
                    "Path" : "NetValueCurrency"
                }
            },
            "TaxAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "TaxAmountCurrency"
                }
            }
        }
    },
    "CB_SALES_ORDER_SRV.SD_VBAP" : {
        "CB_SALES_ORDER_SRVAnnotation.Material" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Material-displayFactSheet?Material={ID0}"
                    }, {
                        "Name" : "ID0",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "Material"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity SD_VBAP"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity SD_VBAP"
            },
            "Title" : {
                "Value" : {
                    "Path" : "SalesOrderItem"
                },
                "EdmType" : "Edm.String"
            },
            "Description" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "Material",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " - "
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesOrderItemText",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                }
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity SD_VBAP"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Value" : {
                    "Path" : "SalesOrderItem"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            },
            "MainInfo" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "Material",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : " - "
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesOrderItemText",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.Material"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesOrderItem"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesOrderItem"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.Material"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "Material",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesOrderItemText",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "OrderQuantity"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "NetAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "MaterialName"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "MaterialByCustomer"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "MaterialGroup",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    }, {
                        "Type" : "Path",
                        "Value" : "MaterialGroupName",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "NetPriceAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "Plant",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    }, {
                        "Type" : "Path",
                        "Value" : "PlantName",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "StorageLocation",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    }, {
                        "Type" : "Path",
                        "Value" : "StorageLocationName",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "ShippingPoint",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    }, {
                        "Type" : "Path",
                        "Value" : "ShippingPointName",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "SDProcessStatusDescription"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "DeliveryStatusDesc"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    },
    "CB_SALES_ORDER_SRV.SalesQuotation" : {
        "CB_SALES_ORDER_SRVAnnotation.SalesQuotation" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [
                            {
                                "Type" : "String",
                                "Value" : "#SalesQuotation-displayFactSheet?SalesQuotation={ID0}"
                            }, {
                                "Name" : "ID0",
                                "Value" : {
                                    "Apply" : {
                                        "Name" : "odata.UriEncode",
                                        "Parameters" : [ {
                                            "Type" : "Path",
                                            "Value" : "SalesQuotation"
                                        } ]
                                    }
                                }
                            } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity SalesQuotation"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity SalesQuotation"
            },
            "Title" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "VBELN_DESCR",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "  ("
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesQuotation",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ") "
                        } ]
                    }
                }
            },
            "Description" : {
                "Value" : {
                    "Path" : "OverallSDDocRefStatusDesc"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity SalesQuotation"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Label" : {
                    "String" : ""
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesQuotation"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "VBELN_DESCR",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "  ("
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesQuotation",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ") "
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            },
            "MainInfo" : {
                "Value" : {
                    "Path" : "OverallSDDocRefStatusDesc"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesQuotation"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "VBELN_DESCR",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesQuotation",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesQuotation"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "VBELN_DESCR",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "  ("
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesQuotation",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ") "
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesQuotationValdtyStartDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesQuotationValidityEndDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "SalesQuotationNetAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "OverallSDDocRefStatusDesc"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    },
    "CB_SALES_ORDER_SRV.SalesContract" : {
        "CB_SALES_ORDER_SRVAnnotation.Customer" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Customer-displayFactSheet?Customer={ID1}"
                    }, {
                        "Name" : "ID1",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "ShipToParty"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "CB_SALES_ORDER_SRVAnnotation.Customer1" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Customer-displayFactSheet?Customer={ID0}"
                    }, {
                        "Name" : "ID0",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "SoldToParty"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "CB_SALES_ORDER_SRVAnnotation.SalesContract" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [
                            {
                                "Type" : "String",
                                "Value" : "#SalesContract-displayFactSheet?SalesContract={ID2}"
                            }, {
                                "Name" : "ID2",
                                "Value" : {
                                    "Apply" : {
                                        "Name" : "odata.UriEncode",
                                        "Parameters" : [ {
                                            "Type" : "Path",
                                            "Value" : "SalesContract"
                                        } ]
                                    }
                                }
                            } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity SalesContract"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity SalesContract"
            },
            "Title" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "VBELN_DESCR",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "  ("
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesContract",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ") "
                        } ]
                    }
                }
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity SalesContract"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Label" : {
                    "String" : ""
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesContract"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "VBELN_DESCR",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "  ("
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesContract",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ") "
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesContract"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "VBELN_DESCR",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : " - "
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesContract",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesContract"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "VBELN_DESCR",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "  ("
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesContract",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ") "
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesContractValidityStartDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesContractValidityEndDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "NetAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    },
    "CB_SALES_ORDER_SRV.BillingDocument" : {
        "CB_SALES_ORDER_SRVAnnotation.BillingDocument" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [
                            {
                                "Type" : "String",
                                "Value" : "#BillingDocument-displayFactSheet?BillingDocument={ID0}"
                            }, {
                                "Name" : "ID0",
                                "Value" : {
                                    "Apply" : {
                                        "Name" : "odata.UriEncode",
                                        "Parameters" : [ {
                                            "Type" : "Path",
                                            "Value" : "BillingDocument"
                                        } ]
                                    }
                                }
                            } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity BillingDocument"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity BillingDocument"
            },
            "Title" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "BillingDocumentDescription",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "  ("
                        }, {
                            "Type" : "Path",
                            "Value" : "BillingDocument",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ") "
                        } ]
                    }
                }
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity BillingDocument"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Label" : {
                    "String" : ""
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.BillingDocument"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "BillingDocumentDescription",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "  ("
                        }, {
                            "Type" : "Path",
                            "Value" : "BillingDocument",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ") "
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [
                {
                    "com.sap.vocabularies.UI.v1.Importance" : {
                        "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
                    },
                    "Target" : {
                        "Path" : "@CB_SALES_ORDER_SRVAnnotation.BillingDocument"
                    },
                    "Label" : {
                        "String" : ""
                    },
                    "Value" : {
                        "Path" : "BillingDocument"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation",
                    "EdmType" : "Edm.String"
                },
                {
                    "com.sap.vocabularies.UI.v1.Importance" : {
                        "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
                    },
                    "Label" : {
                        "String" : ""
                    },
                    "Value" : {
                        "Path" : "BillingDocumentDescription"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                    "EdmType" : "Edm.String"
                } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.BillingDocument"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "BillingDocumentDescription",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "  ("
                    }, {
                        "Type" : "Path",
                        "Value" : "BillingDocument",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ") "
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "BillingDocumentDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "TaxAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    },
    "CB_SALES_ORDER_SRV.OutboundDelivery" : {
        "CB_SALES_ORDER_SRVAnnotation.OutboundDelivery" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [
                            {
                                "Type" : "String",
                                "Value" : "#OutboundDelivery-displayFactSheet?OutboundDelivery={ID0}"
                            }, {
                                "Name" : "ID0",
                                "Value" : {
                                    "Apply" : {
                                        "Name" : "odata.UriEncode",
                                        "Parameters" : [ {
                                            "Type" : "Path",
                                            "Value" : "OutboundDelivery"
                                        } ]
                                    }
                                }
                            } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity OutboundDelivery"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity OutboundDelivery"
            },
            "Title" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "LFART_TEXT",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "  ("
                        }, {
                            "Type" : "Path",
                            "Value" : "OutboundDelivery",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ") "
                        } ]
                    }
                }
            },
            "Description" : {
                "Value" : {
                    "Path" : "FKSTK_DESCRIPTION"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity OutboundDelivery"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Label" : {
                    "String" : ""
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.OutboundDelivery"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "LFART_TEXT",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "  ("
                        }, {
                            "Type" : "Path",
                            "Value" : "OutboundDelivery",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ") "
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            },
            "MainInfo" : {
                "Value" : {
                    "Path" : "FKSTK_DESCRIPTION"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Value" : {
                "Path" : "LFART_TEXT"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.OutboundDelivery"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "LFART_TEXT",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "  ("
                    }, {
                        "Type" : "Path",
                        "Value" : "OutboundDelivery",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ") "
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "DeliveryDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "WBSTK_DESCRIPTION"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "FKSTK_DESCRIPTION"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    }
};

var testResultDataIE = {
    "annotationReferences" : {
        "CB_CUSTOMER_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDMD/cb_customer_anno.xml",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDMD/cb_customer_anno.xml",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDMD/cb_customer_anno.xml"
        },
        "CB_SALES_QUOTATION_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_QUOTATION_SRV_anno.xml",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_QUOTATION_SRV_anno.xml",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_QUOTATION_SRV_anno.xml"
        },
        "CB_SALES_CONTRACT_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_CONTRACT_SRV_anno.xml",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_CONTRACT_SRV_anno.xml",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CB_UI_ANFSDSLS/CB_SALES_CONTRACT_SRV_anno.xml"
        },
        "CB_OUTBOUND_DELIVERY_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CBESH_UI_ANF_LE/CB_OUTBOUND_DELIVERY_SRV_ANNO.xml",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CBESH_UI_ANF_LE/CB_OUTBOUND_DELIVERY_SRV_ANNO.xml",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CBESH_UI_ANF_LE/CB_OUTBOUND_DELIVERY_SRV_ANNO.xml"
        },
        "CB_BILLING_DOCUMENT_SRV" : {
            "com.sap.vocabularies.UI.v1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDBIL/CB_BILLING_DOCUMENT_SRV_ANNO.XML",
            "com.sap.vocabularies.Communication.v1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDBIL/CB_BILLING_DOCUMENT_SRV_ANNO.XML",
            "Org.OData.Measures.V1" : "/sap/bc/bsp/sap/CB_UI_ANF_SDBIL/CB_BILLING_DOCUMENT_SRV_ANNO.XML"
        }
    },
    "aliasDefinitions" : {
        "UI" : "com.sap.vocabularies.UI.v1",
        "vCard" : "com.sap.vocabularies.Communication.v1",
        "CQP" : "Org.OData.Measures.V1",
        "Common" : "com.sap.vocabularies.Common.v1",
        "CB_SALES_ORDER_SRV" : "CB_SALES_ORDER_SRV",
        "CB_CUSTOMER_SRV" : "CB_CUSTOMER_SRV",
        "CB_SALES_QUOTATION_SRV" : "CB_SALES_QUOTATION_SRV",
        "CB_SALES_CONTRACT_SRV" : "CB_SALES_CONTRACT_SRV",
        "CB_OUTBOUND_DELIVERY_SRV" : "CB_OUTBOUND_DELIVERY_SRV",
        "CB_BILLING_DOCUMENT_SRV" : "CB_BILLING_DOCUMENT_SRV"
    },
    "termDefinitions" : {
        "@CB_SALES_ORDER_SRVAnnotation.Customer" : "CB_CUSTOMER_SRV.Customer",
        "@CB_SALES_ORDER_SRVAnnotation.SalesQuotation" : "CB_SALES_QUOTATION_SRV.SalesQuotation",
        "@CB_SALES_ORDER_SRVAnnotation.SalesContract" : "CB_SALES_CONTRACT_SRV.SalesContract",
        "@CB_SALES_ORDER_SRVAnnotation.OutboundDelivery" : "CB_OUTBOUND_DELIVERY_SRV.OutboundDelivery",
        "@CB_SALES_ORDER_SRVAnnotation.BillingDocument" : "CB_BILLING_DOCUMENT_SRV.BillingDocument"
    },
    "propertyExtensions" : {
        "CB_SALES_ORDER_SRV.BillingDocument" : {
            "BillingDocumentDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Document  Description",
                    "filterable" : "false"
                }
            },
            "BillingDocumentType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Document Type",
                    "filterable" : "false"
                }
            },
            "BillingDocumentTypeDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Document Type Description"
                }
            },
            "BillingDocument" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Document Number"
                }
            },
            "BillingDocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Category ID",
                    "filterable" : "false"
                }
            },
            "BillingDocumentCategoryDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Category Description"
                }
            },
            "PayerId" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payer ID"
                }
            },
            "PayerName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payer Name"
                }
            },
            "PayerAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payer Additional Name"
                }
            },
            "PayerCity" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "PayerCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "BillToPartyId" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Bill-To Party ID"
                }
            },
            "BillToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Bill-To Party Name"
                }
            },
            "BillToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Bill-To Party Additional Name"
                }
            },
            "BillToPartyCity" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "BillToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "BillingDocumentDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Date"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization ID"
                }
            },
            "SalesOrganizationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization Name"
                }
            },
            "DistributionChannel" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel ID"
                }
            },
            "DistributionChannelName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel Name"
                }
            },
            "Division" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division ID",
                    "filterable" : "false"
                }
            },
            "DivisionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division Name"
                }
            },
            "NetValue" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "NetValueCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "NetValueCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "TaxAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "TaxAmountCurrency",
                    "label" : "Tax Amount",
                    "filterable" : "false"
                }
            },
            "TaxAmountCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "IncotermsClassification" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms (Part 1)",
                    "filterable" : "false"
                }
            },
            "PaymentTerms" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payment Terms ID",
                    "filterable" : "false"
                }
            },
            "IncotermsClassificationDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms (Part 1) Description",
                    "filterable" : "false"
                }
            },
            "IncotermsTransferLoc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms (Part 2)",
                    "filterable" : "false"
                }
            },
            "PaymentTermsDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Payment Terms Description",
                    "filterable" : "false"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On Date",
                    "filterable" : "false"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On Time",
                    "filterable" : "false"
                }
            },
            "CreatedBy" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created By",
                    "filterable" : "false"
                }
            },
            "CreatedByTitle" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CreatedByUserFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name",
                    "filterable" : "false"
                }
            },
            "CreatedByUserLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status ID",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatusDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status Description"
                }
            },
            "AccountingPostingStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Posting Status ID",
                    "filterable" : "false"
                }
            },
            "AccountingPostingStatusDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Posting Status Description"
                }
            },
            "DocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Category",
                    "filterable" : "false"
                }
            },
            "AccountingDocumentNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Accounting Document Number",
                    "filterable" : "false"
                }
            },
            "CompanyCode" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Company Code",
                    "filterable" : "false"
                }
            },
            "FiscalYear" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Fiscal Year",
                    "filterable" : "false"
                }
            }
        },
        "CB_SALES_ORDER_SRV.Customer" : {
            "FormOfAddress" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CustomerName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Customer Name"
                }
            },
            "Customer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Customer Number"
                }
            },
            "CustomerAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Name"
                }
            },
            "StreetAddressName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Address"
                }
            },
            "CityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City"
                }
            },
            "RegionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Region",
                    "filterable" : "false"
                }
            },
            "CountryName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country"
                }
            },
            "PostalCode" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Postal Code"
                }
            },
            "EmailAddress" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Email"
                }
            },
            "MobilePhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Mobile",
                    "filterable" : "false"
                }
            },
            "PhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Phone"
                }
            },
            "PhoneNumberExtension" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Phone Ext.",
                    "filterable" : "false"
                }
            },
            "FaxNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Fax",
                    "filterable" : "false"
                }
            },
            "FaxNumberExtension" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Fax Ext.",
                    "filterable" : "false"
                }
            },
            "AddressID" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Address ID",
                    "filterable" : "false"
                }
            },
            "SearchTerm" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Search Term"
                }
            }
        },
        "CB_SALES_ORDER_SRV.OutboundDelivery" : {
            "OutboundDelivery" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Outbound Delivery"
                }
            },
            "DeliveryDocumentType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Type",
                    "filterable" : "false"
                }
            },
            "LFART_TEXT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Type Description"
                }
            },
            "OverallSDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "GBSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "KUNNR_WE" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-to Party ID",
                    "filterable" : "false"
                }
            },
            "SoldToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-to Party ID",
                    "filterable" : "false"
                }
            },
            "SoldToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-to Party Name",
                    "filterable" : "false"
                }
            },
            "SoldToPartyName2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Sold-to Party Name",
                    "filterable" : "false"
                }
            },
            "KUNNR_SP" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Forwarding Agent ID",
                    "filterable" : "false"
                }
            },
            "CarrierPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Forwarding Agent Name",
                    "filterable" : "false"
                }
            },
            "CarrierPartyName2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Forwarding Agent Name",
                    "filterable" : "false"
                }
            },
            "TotalGrossWeight" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Total Weight",
                    "filterable" : "false"
                }
            },
            "GEWEI_1_HEAD_MSEH3" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "External Unit of Measurement in Commercial Format (3-Char.)",
                    "filterable" : "false"
                }
            },
            "GEWEI_1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Weight Unit",
                    "filterable" : "false"
                }
            },
            "TotalNetWeight" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Net Weight",
                    "filterable" : "false"
                }
            },
            "GEWEI_2_HEAD_MSEH3" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Weight Unit",
                    "filterable" : "false"
                }
            },
            "GEWEI_2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Weight Unit",
                    "filterable" : "false"
                }
            },
            "ShipToPartyName1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-to Party Name",
                    "filterable" : "false"
                }
            },
            "ShipToPartyName2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Ship-to Party Name",
                    "filterable" : "false"
                }
            },
            "HeaderVolume" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Volume",
                    "filterable" : "false"
                }
            },
            "VOLEH_HEAD_MSEH3" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Volume Unit",
                    "filterable" : "false"
                }
            },
            "HeaderVolumeUnit" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Volume Unit",
                    "filterable" : "false"
                }
            },
            "SDDocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Type",
                    "filterable" : "false"
                }
            },
            "TransportationPlanningStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transportation Planning Status",
                    "filterable" : "false"
                }
            },
            "TRSTA_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transportation Planning Status",
                    "filterable" : "false"
                }
            },
            "OverallPickingStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Picking Status",
                    "filterable" : "false"
                }
            },
            "OverallWarehouseActivityStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Status Warehouse Management Activities",
                    "filterable" : "false"
                }
            },
            "KOSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Picking Status",
                    "filterable" : "false"
                }
            },
            "LVSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Status Warehouse Management Activities",
                    "filterable" : "false"
                }
            },
            "OverallPackingStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Packing Status",
                    "filterable" : "false"
                }
            },
            "PKSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Reference Status",
                    "filterable" : "false"
                }
            },
            "OverallGoodsMovementStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Total Goods Movement Status",
                    "filterable" : "false"
                }
            },
            "WBSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Total Goods Movement Status",
                    "filterable" : "false"
                }
            },
            "OverallDelivReltdBillgStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Status",
                    "filterable" : "false"
                }
            },
            "FKSTK_DESCRIPTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Billing Status",
                    "filterable" : "false"
                }
            },
            "CreatedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created by"
                }
            },
            "USER_NAME_CREATE" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created by",
                    "filterable" : "false"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created on"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Creation Time",
                    "filterable" : "false"
                }
            },
            "LastChangedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Changed by",
                    "filterable" : "false"
                }
            },
            "USER_NAME_CHANGE" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Changed by",
                    "filterable" : "false"
                }
            },
            "LastChangeDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Changed on",
                    "filterable" : "false"
                }
            },
            "ShippingPoint" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Shipping Point"
                }
            },
            "VSTEL_TEXT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Shipping Point"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "VKORG_TEXT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "PlanedGoodsIssueDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Planned Goods Issue Date"
                }
            },
            "LoadingDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Loading Date"
                }
            },
            "TransportationPlanningDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transportation Planning Date"
                }
            },
            "DeliveryDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Date"
                }
            },
            "PickingDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Picking Date"
                }
            },
            "ActualGoodsMovementDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Actual Goods Movement Date",
                    "filterable" : "false"
                }
            },
            "ANZPK" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Number of Packages",
                    "filterable" : "false"
                }
            },
            "INCO1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms 1",
                    "filterable" : "false"
                }
            },
            "INCO2" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Incoterms 2",
                    "filterable" : "false"
                }
            },
            "LIFEX" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "External Delivery ID"
                }
            },
            "SPE_LIFEX_TYPE" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Type of Ext. Identific.",
                    "filterable" : "false"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SD_VBAP" : {
            "Material" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Material",
                    "filterable" : "false"
                }
            },
            "SalesOrder" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Order"
                }
            },
            "OrderQuantity" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Order Quantity",
                    "filterable" : "false"
                }
            },
            "OrderQuantityUnit_E" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "External Unit of Measurement in Commercial Format (3-Char.)",
                    "filterable" : "false"
                }
            },
            "NetAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "TransactionCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "TransactionCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "SalesOrderItem" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Item",
                    "filterable" : "false"
                }
            },
            "SalesOrderItemText" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Item Description",
                    "filterable" : "false"
                }
            },
            "SalesOrderItemCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Item Category",
                    "filterable" : "false"
                }
            },
            "SalesOrderItemCategoryName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Item Category",
                    "filterable" : "false"
                }
            },
            "MaterialByCustomer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Customer Material Number",
                    "filterable" : "false"
                }
            },
            "MaterialName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Material Description",
                    "filterable" : "false"
                }
            },
            "MaterialGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Material Group",
                    "filterable" : "false"
                }
            },
            "MaterialGroupName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Material Group",
                    "filterable" : "false"
                }
            },
            "NetPriceAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "WAERK_NETPR",
                    "label" : "Net Price",
                    "filterable" : "false"
                }
            },
            "WAERK_NETPR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "Plant" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Plant",
                    "filterable" : "false"
                }
            },
            "StorageLocation" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Storage Location",
                    "filterable" : "false"
                }
            },
            "StorageLocationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Storage Location",
                    "filterable" : "false"
                }
            },
            "ShippingPoint" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Shipping Point",
                    "filterable" : "false"
                }
            },
            "ShippingPointName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Shipping Point",
                    "filterable" : "false"
                }
            },
            "PlantName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Plant",
                    "filterable" : "false"
                }
            },
            "SDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "SDProcessStatusDescription" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "DeliveryStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Status",
                    "filterable" : "false"
                }
            },
            "DeliveryStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Status",
                    "filterable" : "false"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesContract" : {
            "VBELN_DESCR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Description",
                    "filterable" : "false"
                }
            },
            "SalesContract" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Contract"
                }
            },
            "SalesContractType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type",
                    "filterable" : "false"
                }
            },
            "SoldToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-To Party"
                }
            },
            "SoldToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "SoldToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Cty",
                    "filterable" : "false"
                }
            },
            "ShipToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-To Party",
                    "filterable" : "false"
                }
            },
            "ShipToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ShipToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Cty",
                    "filterable" : "false"
                }
            },
            "ContactPerson" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Contact Person",
                    "filterable" : "false"
                }
            },
            "ContactPersonFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name",
                    "filterable" : "false"
                }
            },
            "VBTYP" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Category",
                    "filterable" : "false"
                }
            },
            "ContactPersonLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "SoldToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name"
                }
            },
            "ShipToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonPhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Telephone",
                    "filterable" : "false"
                }
            },
            "ShipToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2",
                    "filterable" : "false"
                }
            },
            "PurchaseOrderByCustomer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Purchase Order Number"
                }
            },
            "SalesContractDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Date"
                }
            },
            "SalesContractValidityStartDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Valid From"
                }
            },
            "SalesContractValidityEndDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Valid To"
                }
            },
            "SoldToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2"
                }
            },
            "NetAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "NetAmountCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "OverallSDDocRefStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Reference Status"
                }
            },
            "SalesOrganizationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization"
                }
            },
            "DistributionChannel" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel",
                    "filterable" : "false"
                }
            },
            "DistributionChannelName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel"
                }
            },
            "Division" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division",
                    "filterable" : "false"
                }
            },
            "DivisionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division"
                }
            },
            "SalesGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group",
                    "filterable" : "false"
                }
            },
            "SalesGroupName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesOffice" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office",
                    "filterable" : "false"
                }
            },
            "SalesOfficeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "NetAmountCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "SalesContractTypeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On",
                    "filterable" : "false"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Time",
                    "filterable" : "false"
                }
            },
            "CreatedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created By"
                }
            },
            "AcademicTitleName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CreatedByUserFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name"
                }
            },
            "CreatedByUserLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name"
                }
            },
            "TransactionGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transaction Group",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status"
                }
            },
            "VBELN_GRP" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Group Contract"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesOrder" : {
            "VBELN_DESCR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Description",
                    "filterable" : "false"
                }
            },
            "SalesOrderType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type",
                    "filterable" : "false"
                }
            },
            "SalesOrderTypeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type"
                }
            },
            "SoldToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-To Party"
                }
            },
            "SoldToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "SoldToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "SalesOrder" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Order"
                }
            },
            "PurchaseOrderByCustomer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Purchase Order Number"
                }
            },
            "SalesOrderDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Date"
                }
            },
            "SoldToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name"
                }
            },
            "NetAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "TransactionCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "SoldToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Additional Name"
                }
            },
            "ShipToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-To Party"
                }
            },
            "ShipToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ShipToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Cty",
                    "filterable" : "false"
                }
            },
            "ContactPerson" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Contact Person",
                    "filterable" : "false"
                }
            },
            "ContactPersonFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ContactPersonPhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Telephone",
                    "filterable" : "false"
                }
            },
            "ShipToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name"
                }
            },
            "ShipToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "SalesOrganizationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization"
                }
            },
            "DistributionChannel" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel",
                    "filterable" : "false"
                }
            },
            "DistributionChannelName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel"
                }
            },
            "Division" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division",
                    "filterable" : "false"
                }
            },
            "DivisionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division"
                }
            },
            "SalesGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesGroupName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesOffice" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "SalesOfficeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "TransactionCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "RequestedDeliveryDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Requested Delivery Date"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Time",
                    "filterable" : "false"
                }
            },
            "CreatedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created By"
                }
            },
            "AcademicTitleName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CreatedByUserFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name"
                }
            },
            "CreatedByUserLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name"
                }
            },
            "TransactionGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Transaction Group",
                    "filterable" : "false"
                }
            },
            "SDDocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Category",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status"
                }
            },
            "OverallDeliveryStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Status",
                    "filterable" : "false"
                }
            },
            "OverallDeliveryStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Delivery Status"
                }
            },
            "TotalCreditCheckStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Credit Status",
                    "filterable" : "false"
                }
            },
            "TotalCreditCheckStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Credit Status"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesQuotation" : {
            "VBELN_DESCR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type",
                    "filterable" : "false"
                }
            },
            "SalesQuotationType" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type",
                    "filterable" : "false"
                }
            },
            "SalesQuotationTypeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Type"
                }
            },
            "SoldToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-To Party"
                }
            },
            "SalesQuotation" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Quotation"
                }
            },
            "SoldToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "SoldToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "SoldToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sold-To Party"
                }
            },
            "SoldToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2"
                }
            },
            "ContactPerson" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Contact Person",
                    "filterable" : "false"
                }
            },
            "PurchaseOrderByCustomer" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Purchase Order Number"
                }
            },
            "SalesQuotationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Document Date"
                }
            },
            "SalesQuotationValdtyStartDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Valid From"
                }
            },
            "SalesQuotationValidityEndDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Valid To"
                }
            },
            "ShipToParty" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-To Party"
                }
            },
            "ShipToPartyName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Ship-To Party"
                }
            },
            "ShipToPartyAdditionalName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Name 2"
                }
            },
            "ShipToPartyCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ShipToPartyCountry" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Country",
                    "filterable" : "false"
                }
            },
            "ContactPersonFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name",
                    "filterable" : "false"
                }
            },
            "ContactPersonCityName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "City",
                    "filterable" : "false"
                }
            },
            "ContactPersonPhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Telephone",
                    "filterable" : "false"
                }
            },
            "SalesQuotationNetAmount" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "unit" : "TransactionCurrency",
                    "label" : "Net Value",
                    "filterable" : "false"
                }
            },
            "SalesOrganization" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization",
                    "filterable" : "false"
                }
            },
            "SalesOrganizationName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Organization"
                }
            },
            "DistributionChannel" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel",
                    "filterable" : "false"
                }
            },
            "DistributionChannelName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Distribution Channel"
                }
            },
            "Division" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division",
                    "filterable" : "false"
                }
            },
            "DivisionName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Division"
                }
            },
            "SalesGroup" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesGroupName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Group"
                }
            },
            "SalesOffice" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "SalesOfficeName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Office"
                }
            },
            "TransactionCurrency" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Currency",
                    "filterable" : "false",
                    "semantics" : "currency-code"
                }
            },
            "CreationDate" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created On",
                    "filterable" : "false"
                }
            },
            "CreationTime" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Time",
                    "filterable" : "false"
                }
            },
            "CreatedByUser" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Created By"
                }
            },
            "AcademicTitleName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title",
                    "filterable" : "false"
                }
            },
            "CreatedByUserFirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name"
                }
            },
            "CreatedByUserLastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name"
                }
            },
            "SDDocumentCategory" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Sales Document Category",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status",
                    "filterable" : "false"
                }
            },
            "OverallSDProcessStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Overall Processing Status"
                }
            },
            "OverallSDDocReferenceStatus" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Reference Status",
                    "filterable" : "false"
                }
            },
            "OverallSDDocRefStatusDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Reference Status"
                }
            },
            "OverallSDDocumentRejectionSts" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Rejection Status",
                    "filterable" : "false"
                }
            },
            "OvrlSDDocumentRejectionStsDesc" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Rejection Status"
                }
            }
        },
        "CB_SALES_ORDER_SRV.USER_H" : {
            "User" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "User Name"
                }
            },
            "AddressID" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Addr. no."
                }
            },
            "VALUE_TEXT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Title"
                }
            },
            "VALUE_TEXT1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Academic Title"
                }
            },
            "FirstName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "First Name"
                }
            },
            "LastName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Last Name"
                }
            },
            "PersonFullName" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Full Name"
                }
            },
            "NAME1" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Company"
                }
            },
            "DEPARTMENT" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Department",
                    "filterable" : "false"
                }
            },
            "FUNCTION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Function",
                    "filterable" : "false"
                }
            },
            "EmailAddress" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "E-Mail"
                }
            },
            "PROFESSION" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Profession"
                }
            },
            "InternationalPhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Telephone"
                }
            },
            "MobilePhoneNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Mobile"
                }
            },
            "BUILDING" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Building",
                    "filterable" : "false"
                }
            },
            "FLOOR" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Floor",
                    "filterable" : "false"
                }
            },
            "ROOMNUMBER" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Room No.",
                    "filterable" : "false"
                }
            },
            "InternationalFaxNumber" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Fax number"
                }
            },
            "IH_MAIL" : {
                "http://www.sap.com/Protocols/SAPData" : {
                    "label" : "Int. mail",
                    "filterable" : "false"
                }
            }
        }
    },
    "CB_SALES_ORDER_SRV.SalesOrder" : {
        "CB_SALES_ORDER_SRVAnnotation.Customer" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Customer-displayFactSheet?Customer={ID1}"
                    }, {
                        "Name" : "ID1",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "ShipToParty"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "CB_SALES_ORDER_SRVAnnotation.Customer1" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Customer-displayFactSheet?Customer={ID0}"
                    }, {
                        "Name" : "ID0",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "SoldToParty"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : ""
            },
            "TypeNamePlural" : {
                "String" : ""
            },
            "Title" : {
                "Value" : {
                    "Path" : "VBELN_DESCR"
                },
                "EdmType" : "Edm.String"
            },
            "Description" : {
                "Value" : {
                    "Path" : "SalesOrder"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : ""
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Value" : {
                    "Path" : "VBELN_DESCR"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            },
            "MainInfo" : {
                "Value" : {
                    "Path" : "SalesOrder"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "SalesOrderType"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.Customer1"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "SoldToParty",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    }, {
                        "Type" : "Path",
                        "Value" : "SoldToPartyName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ","
                    }, {
                        "Type" : "Path",
                        "Value" : "SoldToPartyAdditionalName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ","
                    }, {
                        "Type" : "Path",
                        "Value" : "SoldToPartyCityName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ","
                    }, {
                        "Type" : "Path",
                        "Value" : "SoldToPartyCountry",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.Customer"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "ShipToParty",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    }, {
                        "Type" : "Path",
                        "Value" : "ShipToPartyName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ","
                    }, {
                        "Type" : "Path",
                        "Value" : "ShipToPartyAdditionalName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ","
                    }, {
                        "Type" : "Path",
                        "Value" : "ShipToPartyCityName",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ",  ("
                    }, {
                        "Type" : "Path",
                        "Value" : "ShipToPartyCountry",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ")"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesOrderDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "PurchaseOrderByCustomer"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "NetAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "RequestedDeliveryDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        } ],
        "com.sap.vocabularies.UI.v1.FieldGroup#Detail2" : {
            "Label" : {
                "String" : ""
            },
            "Data" : [ {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "SalesOrganization",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "-"
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesOrganizationName",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "DistributionChannel",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "-"
                        }, {
                            "Type" : "Path",
                            "Value" : "DistributionChannelName",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "Division",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "-"
                        }, {
                            "Type" : "Path",
                            "Value" : "DivisionName",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "%"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "SalesGroup",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "-"
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesGroupName",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "SalesOffice",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "-"
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesOfficeName",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            } ]
        },
        "com.sap.vocabularies.UI.v1.FieldGroup#Detail3" : {
            "Label" : {
                "String" : ""
            },
            "Data" : [ {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "CreationDate",
                            "EdmType" : "Edm.Date"
                        }, {
                            "Type" : "String",
                            "Value" : ","
                        }, {
                            "Type" : "Path",
                            "Value" : "CreationTime",
                            "EdmType" : "Edm.Time"
                        }, {
                            "Type" : "String",
                            "Value" : "/"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "CreatedByUser",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "-"
                        }, {
                            "Type" : "Path",
                            "Value" : "AcademicTitleName",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ""
                        }, {
                            "Type" : "Path",
                            "Value" : "CreatedByUserLastName",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "="
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            } ]
        },
        "com.sap.vocabularies.UI.v1.FieldGroup#Detail4" : {
            "Label" : {
                "String" : ""
            },
            "Data" : [ {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
                },
                "Value" : {
                    "Path" : "OverallDeliveryStatusDesc"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            }, {
                "com.sap.vocabularies.UI.v1.Importance" : {
                    "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
                },
                "Value" : {
                    "Path" : "TotalCreditCheckStatusDesc"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            } ]
        },
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "Value" : {
                "Path" : "TotalCreditCheckStatusDesc"
            },
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "SalesOrder"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "VBELN_DESCR"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [
                {
                    "com.sap.vocabularies.UI.v1.IsSummary" : {},
                    "Label" : {},
                    "Facets" : [
                            {
                                "Label" : {
                                    "String" : "Column B                                                                                                                                                                                                                                                       "
                                },
                                "Target" : {
                                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                                },
                                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                            },
                            {
                                "Label" : {
                                    "String" : ""
                                },
                                "Target" : {
                                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.FieldGroup#Detail2"
                                },
                                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                            },
                            {
                                "Label" : {
                                    "String" : ""
                                },
                                "Target" : {
                                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.FieldGroup#Detail3"
                                },
                                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                            },
                            {
                                "Label" : {
                                    "String" : ""
                                },
                                "Target" : {
                                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.FieldGroup#Detail4"
                                },
                                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                            } ],
                    "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "SNAV_SO_VBAP/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "CPREVIOUS_QUOTATION/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "CPREVIOUS_CONTRACT/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "CSUBS_OUTBOUND_DELIVERY/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                },
                {
                    "Label" : {
                        "String" : ""
                    },
                    "Target" : {
                        "AnnotationPath" : "CSUBS_BILLING_DOCUMENTS/@com.sap.vocabularies.UI.v1.LineItem"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
                } ],
        "com.sap.vocabularies.UI.v1.DataPoint#01" : {
            "Title" : {
                "String" : ""
            },
            "Value" : {
                "Path" : "NetAmount",
                "EdmType" : "Edm.Decimal"
            }
        },
        "com.sap.vocabularies.UI.v1.DataPoint#02" : {
            "Title" : {
                "String" : ""
            },
            "Value" : {
                "Path" : "OverallSDProcessStatusDesc",
                "EdmType" : "Edm.String"
            }
        }
    },
    "propertyAnnotations" : {
        "CB_SALES_ORDER_SRV.SalesOrder" : {
            "NetAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "TransactionCurrency"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SD_VBAP" : {
            "NetAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "TransactionCurrency"
                }
            },
            "NetPriceAmount" : {
                "Org.OData.Measures.V1.ISOCurrency" : {
                    "Path" : "WAERK_NETPR"
                }
            },
            "OrderQuantity" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "OrderQuantityUnit_E"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesQuotation" : {
            "SalesQuotationNetAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "TransactionCurrency"
                }
            }
        },
        "CB_SALES_ORDER_SRV.SalesContract" : {
            "NetAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "NetAmountCurrency"
                }
            }
        },
        "CB_SALES_ORDER_SRV.BillingDocument" : {
            "NetValue" : {
                "Org.OData.Measures.V1.ISOCurrency" : {
                    "Path" : "NetValueCurrency"
                }
            },
            "TaxAmount" : {
                "Org.OData.Measures.V1.Unit" : {
                    "Path" : "TaxAmountCurrency"
                }
            }
        }
    },
    "CB_SALES_ORDER_SRV.SD_VBAP" : {
        "CB_SALES_ORDER_SRVAnnotation.Material" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Material-displayFactSheet?Material={ID0}"
                    }, {
                        "Name" : "ID0",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "Material"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity SD_VBAP"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity SD_VBAP"
            },
            "Title" : {
                "Value" : {
                    "Path" : "SalesOrderItem"
                },
                "EdmType" : "Edm.String"
            },
            "Description" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "Material",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "-"
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesOrderItemText",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                }
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity SD_VBAP"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Value" : {
                    "Path" : "SalesOrderItem"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                "EdmType" : "Edm.String"
            },
            "MainInfo" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "Material",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "-"
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesOrderItemText",
                            "EdmType" : "Edm.String"
                        } ]
                    }
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.Material"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesOrderItem"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesOrderItem"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.Material"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "Material",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesOrderItemText",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "OrderQuantity"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "NetAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "MaterialName"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "MaterialByCustomer"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "MaterialGroup",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    }, {
                        "Type" : "Path",
                        "Value" : "MaterialGroupName",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "NetPriceAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "Plant",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    }, {
                        "Type" : "Path",
                        "Value" : "PlantName",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "StorageLocation",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    }, {
                        "Type" : "Path",
                        "Value" : "StorageLocationName",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "ShippingPoint",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    }, {
                        "Type" : "Path",
                        "Value" : "ShippingPointName",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "SDProcessStatusDescription"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Low"
            },
            "Value" : {
                "Path" : "DeliveryStatusDesc"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    },
    "CB_SALES_ORDER_SRV.SalesQuotation" : {
        "CB_SALES_ORDER_SRVAnnotation.SalesQuotation" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [
                            {
                                "Type" : "String",
                                "Value" : "#SalesQuotation-displayFactSheet?SalesQuotation={ID0}"
                            }, {
                                "Name" : "ID0",
                                "Value" : {
                                    "Apply" : {
                                        "Name" : "odata.UriEncode",
                                        "Parameters" : [ {
                                            "Type" : "Path",
                                            "Value" : "SalesQuotation"
                                        } ]
                                    }
                                }
                            } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity SalesQuotation"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity SalesQuotation"
            },
            "Title" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "VBELN_DESCR",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "("
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesQuotation",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ")"
                        } ]
                    }
                }
            },
            "Description" : {
                "Value" : {
                    "Path" : "OverallSDDocRefStatusDesc"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity SalesQuotation"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Label" : {
                    "String" : ""
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesQuotation"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "VBELN_DESCR",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "("
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesQuotation",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ")"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            },
            "MainInfo" : {
                "Value" : {
                    "Path" : "OverallSDDocRefStatusDesc"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesQuotation"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "VBELN_DESCR",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesQuotation",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesQuotation"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "VBELN_DESCR",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "("
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesQuotation",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ")"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesQuotationValdtyStartDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesQuotationValidityEndDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "SalesQuotationNetAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "OverallSDDocRefStatusDesc"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    },
    "CB_SALES_ORDER_SRV.SalesContract" : {
        "CB_SALES_ORDER_SRVAnnotation.Customer" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Customer-displayFactSheet?Customer={ID1}"
                    }, {
                        "Name" : "ID1",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "ShipToParty"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "CB_SALES_ORDER_SRVAnnotation.Customer1" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [ {
                        "Type" : "String",
                        "Value" : "#Customer-displayFactSheet?Customer={ID0}"
                    }, {
                        "Name" : "ID0",
                        "Value" : {
                            "Apply" : {
                                "Name" : "odata.UriEncode",
                                "Parameters" : [ {
                                    "Type" : "Path",
                                    "Value" : "SoldToParty"
                                } ]
                            }
                        }
                    } ]
                }
            }
        },
        "CB_SALES_ORDER_SRVAnnotation.SalesContract" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [
                            {
                                "Type" : "String",
                                "Value" : "#SalesContract-displayFactSheet?SalesContract={ID2}"
                            }, {
                                "Name" : "ID2",
                                "Value" : {
                                    "Apply" : {
                                        "Name" : "odata.UriEncode",
                                        "Parameters" : [ {
                                            "Type" : "Path",
                                            "Value" : "SalesContract"
                                        } ]
                                    }
                                }
                            } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity SalesContract"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity SalesContract"
            },
            "Title" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "VBELN_DESCR",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "("
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesContract",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ")"
                        } ]
                    }
                }
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity SalesContract"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Label" : {
                    "String" : ""
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesContract"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "VBELN_DESCR",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "("
                        }, {
                            "Type" : "Path",
                            "Value" : "SalesContract",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ")"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesContract"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "VBELN_DESCR",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "-"
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesContract",
                        "EdmType" : "Edm.String"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.SalesContract"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "VBELN_DESCR",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "("
                    }, {
                        "Type" : "Path",
                        "Value" : "SalesContract",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ")"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesContractValidityStartDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "SalesContractValidityEndDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "NetAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    },
    "CB_SALES_ORDER_SRV.BillingDocument" : {
        "CB_SALES_ORDER_SRVAnnotation.BillingDocument" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [
                            {
                                "Type" : "String",
                                "Value" : "#BillingDocument-displayFactSheet?BillingDocument={ID0}"
                            }, {
                                "Name" : "ID0",
                                "Value" : {
                                    "Apply" : {
                                        "Name" : "odata.UriEncode",
                                        "Parameters" : [ {
                                            "Type" : "Path",
                                            "Value" : "BillingDocument"
                                        } ]
                                    }
                                }
                            } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity BillingDocument"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity BillingDocument"
            },
            "Title" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "BillingDocumentDescription",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "("
                        }, {
                            "Type" : "Path",
                            "Value" : "BillingDocument",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ")"
                        } ]
                    }
                }
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity BillingDocument"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Label" : {
                    "String" : ""
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.BillingDocument"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "BillingDocumentDescription",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "("
                        }, {
                            "Type" : "Path",
                            "Value" : "BillingDocument",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ")"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [
                {
                    "com.sap.vocabularies.UI.v1.Importance" : {
                        "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
                    },
                    "Target" : {
                        "Path" : "@CB_SALES_ORDER_SRVAnnotation.BillingDocument"
                    },
                    "Label" : {
                        "String" : ""
                    },
                    "Value" : {
                        "Path" : "BillingDocument"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation",
                    "EdmType" : "Edm.String"
                },
                {
                    "com.sap.vocabularies.UI.v1.Importance" : {
                        "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
                    },
                    "Label" : {
                        "String" : ""
                    },
                    "Value" : {
                        "Path" : "BillingDocumentDescription"
                    },
                    "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
                    "EdmType" : "Edm.String"
                } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.BillingDocument"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "BillingDocumentDescription",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "("
                    }, {
                        "Type" : "Path",
                        "Value" : "BillingDocument",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ")"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "BillingDocumentDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "TaxAmount"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Decimal"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    },
    "CB_SALES_ORDER_SRV.OutboundDelivery" : {
        "CB_SALES_ORDER_SRVAnnotation.OutboundDelivery" : {
            "UrlRef" : {
                "Apply" : {
                    "Name" : "odata.fillUriTemplate",
                    "Parameters" : [
                            {
                                "Type" : "String",
                                "Value" : "#OutboundDelivery-displayFactSheet?OutboundDelivery={ID0}"
                            }, {
                                "Name" : "ID0",
                                "Value" : {
                                    "Apply" : {
                                        "Name" : "odata.UriEncode",
                                        "Parameters" : [ {
                                            "Type" : "Path",
                                            "Value" : "OutboundDelivery"
                                        } ]
                                    }
                                }
                            } ]
                }
            }
        },
        "com.sap.vocabularies.UI.v1.HeaderInfo" : {
            "TypeName" : {
                "String" : "No Label maintained for Entity OutboundDelivery"
            },
            "TypeNamePlural" : {
                "String" : "No Label maintained for Entity OutboundDelivery"
            },
            "Title" : {
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "LFART_TEXT",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "("
                        }, {
                            "Type" : "Path",
                            "Value" : "OutboundDelivery",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ")"
                        } ]
                    }
                }
            },
            "Description" : {
                "Value" : {
                    "Path" : "FKSTK_DESCRIPTION"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Badge" : {
            "Headline" : {
                "Value" : {
                    "String" : "No Label maintained for Entity OutboundDelivery"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataField"
            },
            "Title" : {
                "Label" : {
                    "String" : ""
                },
                "Target" : {
                    "Path" : "@CB_SALES_ORDER_SRVAnnotation.OutboundDelivery"
                },
                "Value" : {
                    "Apply" : {
                        "Name" : "odata.concat",
                        "Parameters" : [ {
                            "Type" : "Path",
                            "Value" : "LFART_TEXT",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : "("
                        }, {
                            "Type" : "Path",
                            "Value" : "OutboundDelivery",
                            "EdmType" : "Edm.String"
                        }, {
                            "Type" : "String",
                            "Value" : ")"
                        } ]
                    }
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
            },
            "MainInfo" : {
                "Value" : {
                    "Path" : "FKSTK_DESCRIPTION"
                },
                "EdmType" : "Edm.String"
            }
        },
        "com.sap.vocabularies.UI.v1.Identification" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Value" : {
                "Path" : "LFART_TEXT"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.LineItem" : [ {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Label" : {
                "String" : ""
            },
            "Target" : {
                "Path" : "@CB_SALES_ORDER_SRVAnnotation.OutboundDelivery"
            },
            "Value" : {
                "Apply" : {
                    "Name" : "odata.concat",
                    "Parameters" : [ {
                        "Type" : "Path",
                        "Value" : "LFART_TEXT",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : "("
                    }, {
                        "Type" : "Path",
                        "Value" : "OutboundDelivery",
                        "EdmType" : "Edm.String"
                    }, {
                        "Type" : "String",
                        "Value" : ")"
                    } ]
                }
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataFieldWithNavigation"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "DeliveryDate"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.Date"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/Medium"
            },
            "Value" : {
                "Path" : "WBSTK_DESCRIPTION"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        }, {
            "com.sap.vocabularies.UI.v1.Importance" : {
                "EnumMember" : "com.sap.vocabularies.UI.v1.Priority/High"
            },
            "Value" : {
                "Path" : "FKSTK_DESCRIPTION"
            },
            "RecordType" : "com.sap.vocabularies.UI.v1.DataField",
            "EdmType" : "Edm.String"
        } ],
        "com.sap.vocabularies.UI.v1.Facets" : [ {
            "com.sap.vocabularies.UI.v1.IsSummary" : {},
            "Label" : {},
            "Facets" : [ {
                "Label" : {},
                "Target" : {
                    "AnnotationPath" : "@com.sap.vocabularies.UI.v1.Identification"
                },
                "RecordType" : "com.sap.vocabularies.UI.v1.ReferenceFacet"
            } ],
            "RecordType" : "com.sap.vocabularies.UI.v1.CollectionFacet"
        } ]
    }
};
