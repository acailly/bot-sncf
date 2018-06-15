# bot-sncf

Get info on SNCF trains

## Usage

```
Usage: sncf [options] <from> <to>

  Get info on SNCF trains

  Options:

    --help  output usage information
```

## Config (config.yaml)

```yaml
sncf:
  locations:
    - name: chateaubourg
      code: OCE:SA:87471524
    - name: rennes
      code: OCE:SA:87471003
  token: your_api_token
```

## How do I get my api token?

Go to https://www.digital.sncf.com/startup/api

## How do I find the code of a location?

Go to http://canaltp.github.io/navitia-playground/

Enter your API token and fill the fields to build the following request:

```
https://api.navitia.io/v1/coverage/sncf/places?q=your_place_name&type%5B%5D=stop_area&
```

Expand the JSON of each place and look at the `id` field, it should be something like:

```
stop_area:OCE:SA:87471524
```

The code you are looking for is `OCE:SA:87471524`
