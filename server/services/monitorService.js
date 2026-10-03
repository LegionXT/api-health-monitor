const axios = require("axios");

const Api = require("../models/Api");
const HealthCheck = require("../models/HealthCheck");


// ========================================
// Check a single API
// ========================================

const checkApi = async (api) => {
  const startTime = Date.now();

  try {
    const response = await axios({
      method: api.method,
      url: api.url,

      timeout: 10000,

      // Don't let Axios throw an error
      // for HTTP 4xx/5xx responses.
      validateStatus: () => true
    });

    const responseTime = Date.now() - startTime;

    // 2xx and 3xx responses are considered UP
    const isUp =
      response.status >= 200 &&
      response.status < 400;

    // Save health check
    await HealthCheck.create({
      api: api._id,
      status: isUp ? "UP" : "DOWN",
      responseTime,
      statusCode: response.status
    });

    // Calculate uptime
    const totalChecks =
      await HealthCheck.countDocuments({
        api: api._id
      });

    const successfulChecks =
      await HealthCheck.countDocuments({
        api: api._id,
        status: "UP"
      });

    const uptime =
      totalChecks === 0
        ? 100
        : Number(
            (
              (successfulChecks / totalChecks) *
              100
            ).toFixed(2)
          );

    // Update API
    await Api.findByIdAndUpdate(
      api._id,
      {
        status: isUp ? "UP" : "DOWN",
        responseTime,
        uptime,
        lastChecked: new Date()
      }
    );

    return {
      status: isUp ? "UP" : "DOWN",
      responseTime,
      statusCode: response.status
    };

  } catch (error) {

    const responseTime = Date.now() - startTime;

    // Save failed health check
    await HealthCheck.create({
      api: api._id,
      status: "DOWN",
      responseTime,
      statusCode: null
    });

    // Calculate uptime
    const totalChecks =
      await HealthCheck.countDocuments({
        api: api._id
      });

    const successfulChecks =
      await HealthCheck.countDocuments({
        api: api._id,
        status: "UP"
      });

    const uptime =
      totalChecks === 0
        ? 0
        : Number(
            (
              (successfulChecks / totalChecks) *
              100
            ).toFixed(2)
          );

    // Update API
    await Api.findByIdAndUpdate(
      api._id,
      {
        status: "DOWN",
        responseTime,
        uptime,
        lastChecked: new Date()
      }
    );

    return {
      status: "DOWN",
      responseTime,
      statusCode: null
    };
  }
};


// ========================================
// Check all APIs
// ========================================

const checkAllApis = async () => {

  const apis = await Api.find();

  console.log(
    `Checking ${apis.length} monitored API(s)...`
  );

  for (const api of apis) {

    console.log(
      `Checking: ${api.name} → ${api.url}`
    );

    const result = await checkApi(api);

    console.log(
      `${api.name}: ${result.status} | ${result.responseTime} ms`
    );
  }
};


module.exports = {
  checkApi,
  checkAllApis
};