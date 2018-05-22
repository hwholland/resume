# solo

Small-business ERP toolkit that provides bookkeeping, reporting, and workflow.  Additionally, the system has the capability of identifying opportunities to improve business processes based on observing trends as data is captured during the business transactions.  

## Architecture

Solo is an implementation of general systems theory.  At it's core is a data model which is abstract such that all business transactions can be categorized neatly into distinct groups.

... [finish this at some point]

## Getting Started

These instructions will get you a copy of the software up and running on a local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node.js must be already installed on the computer/server where this application will run.

The Redis database is used by the current version as the primary method of storing structured data, which includes (but is not limited to):

* Master data to include things (materials/products/services), companies, people, locations, or accounts (financial) and other datasets which are largely static and multi-use / multi-state by nature.
* Transactions to include business expenses, purchase orders, goods receipts, timesheets, payments, and other datasets which are largely dynamic and single-use by nature (transactional data is a point in time relationship between one or more master data objects). 
* User accounts: including credentials for authorization, field-level security roles, and activity logs.

In the current version, data models to support the dynamic generation of user-interface content is implemented using JSON files for ease of change.  Therefore, it is entirely possible to run the application without the database instance, so long as no data storage requirements exist.  

Additionally, the application architecture dictates that the database communication must be abstracted from any particular vendor such that the database platform can "plug-and-play" with this application if a platform change is required at any time in the future.  For this reason, the Redis database is only a soft-requirement if the installation is for demonstration purposes only.

If Redis is installed on the local machine the database instance is configured in the "Router" class (tables.js.Router) as shown below:

```
function Router(oApp, oExpress) {
    this.router = oExpress.Router();
    this.app = oApp;
    this.app.use(this.router);
    this.core = new Core();
    console.log(this.core);
    this.redis = new Redis();
    this.redis.connect(1);		// MODIFY THIS LINE (CHANGE VALUE 1 TO DB #)
}

```

Last, the OpenUI5 framework must be installed into a folder called 'ui5' at the root path of this package.  Currently, there is one set of libraries which is required by this application but not provided as part of the open-source package.  The OpenUI5 framework will ultimately have to be packaged with this
git repository but it is not currently included.  

*Note: this requirement will likely prevent the application from functioning as expected if deployed by anyone other than Harrison - who has the complete OpenUI5 libraries (including the sap.viz libraries) on his laptop.  Ask him for help if needed.*

### Installing

Download the package to the host computer (desktop or server), then navigate
to the project's directory on the filesystem using a command-prompt or terminal.

```
~/solo
```

Run the following command to install the node.js dependency modules.

```
sudo npm install
```

For Windows machines do not include "sudo"

## Deployment

In the same directory as the installation path, run the following command

```
node index.js
```

## Built With

* [OpenUI5](https://github.com/openui5) - The user-interface framework
* [Node.js](https://nodejs.org) - Server-side JavaScript engine
* [Express](https://github.com/expressjs/express) - The web framework


## Authors

* **Juichia Che** - *Concept*
* **Harrison Holland** - *Software Architecture & Engineering, Database Design & Implementation, User Interface Design* - [hwholland](https://github.com/hwholland)
