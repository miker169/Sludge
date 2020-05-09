# YW-sludge-modelling-frontend

### Contains all code for local development, testing and deployment of static frontend with azure function based backend

###Branching strategy

* Pull master
* Checkout onto new development branch, including feature name, ie rl-yw-development-blob-json-file-upload
* Develop required feature and test locally
* Create pull request between local branch and development
* Review and merge
* Wait for new dev deployment in Azure and test change
* Create pull request between development and master
* Wait for new prod deployment in Azure and test change
* Re start process with new feature
