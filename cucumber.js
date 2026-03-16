module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/test/steps/*.ts'],
    format: ['progress-bar', 'summary', 'json:docs/evidence/bdd_report.json'],
    parallel: 1,
  },
}
