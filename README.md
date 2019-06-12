# project-lite
web components and vanilla javascript based project


## Running project

``` bash
# install dependencies
npm install

# install json-server globally
npm install -g json-server

# create db.json folder with the following content
touch db.json

{
  "payments": [

  ]
}

# run json-server on db.json
json-server --watch db.json

```

## Notes

Some of the features are not supported by json-server (like OR operator and aggregate functions), so I had to use different approaches.
