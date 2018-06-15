const _ = require('lodash')
const request = require('request')
const moment = require('moment')
const chalk = require('chalk')

// Navitia playground : http://canaltp.github.io/navitia-playground/

const apiDateTimeFormat = 'YYYYMMDDTHHmmss'
const hourDateTimeFormat = 'HH:mm'

module.exports = function (vorpal) {
  const locationNames = vorpal.config.sncf.locations.map(location => location.name)

  vorpal
    .command('sncf <from> <to>')
    .description('Get info on SNCF trains')
    .autocomplete(locationNames)
    .action(function (args, callback) {
      const username = vorpal.config.sncf.token

      const apiRoot = 'https://api.sncf.com/v1/coverage/sncf/'

      const departureLocation = _.get(
        _.find(vorpal.config.sncf.locations, location => location.name === args.from),
        'code',
        args.from
      )
      const arrivalLocation = _.get(
        _.find(vorpal.config.sncf.locations, location => location.name === args.to),
        'code',
        args.to
      )
      const fromDateTime = moment().format(apiDateTimeFormat)

      const requestUrl = `${apiRoot}/journeys?from=stop_area:${departureLocation}&to=stop_area:${arrivalLocation}&datetime=${fromDateTime}&count=10&`

      this.log(requestUrl)
      this.log(username)

      request
        .get(requestUrl, {
          auth: {
            user: username,
            password: '',
            sendImmediately: true
          }
        }, (error, response, body) => {
          if (error) {
            return callback(error)
          }
          body = JSON.parse(body)

          const journeys = body.journeys

          if (journeys) {
            const result = journeys
              .map(({
                departure_date_time,
                arrival_date_time
              }) => {
                const departureDateTime =
                  moment(departure_date_time, apiDateTimeFormat)
                const arrivalDateTime =
                  moment(arrival_date_time, apiDateTimeFormat)

                const departureTime = departureDateTime.format(hourDateTimeFormat)
                const arrivalTime = arrivalDateTime.format(hourDateTimeFormat)
                const timeDifferenceInMinutes = arrivalDateTime
                  .diff(departureDateTime, 'minutes')

                const colorize = chalk.green

                return colorize(`${departureTime} --> ${arrivalTime} (${timeDifferenceInMinutes} min)`)
              }).join('\n')

            callback(result)
          } else {
            callback('Nothing found')
          }
        })
    })
}