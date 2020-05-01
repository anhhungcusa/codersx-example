const router = require("express").Router();
const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");
const doc = yaml.load("api/docs/swagger.yaml");
router.use(swaggerUI.serve);
router.get("/", swaggerUI.setup(doc));
module.exports = router;
