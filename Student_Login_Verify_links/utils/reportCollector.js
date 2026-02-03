const steps = [];

function logStep({ pageName, url, action, toast, status, responseStatus, note }) {
  steps.push({
    time: new Date().toLocaleString(),
    pageName,
    url,
    action,
    toast: toast || 'N/A',
    status: status || 'N/A',
    responseStatus: responseStatus !== undefined ? responseStatus : 'N/A',
    note: note || 'N/A'
  });
}

function getSteps() {
  return steps;
}

module.exports = { logStep, getSteps };
