# React Native useDatabase
A wrapper around a React `state` and `AsyncStorage` that basically creates an in-memory database that stays synced with a collection in `AsyncStorage`.

### Setup

First, add it to your project as you normally would.

`$ yarn add react-native-use-database`

Make sure to also add the peer dependencies: `@react-native-community/async-storage` and `uuid`:

`$ yarn add @react-native-community/async-storage uuid`

Finally, you can import it into your project.

`import useDatabase from "react-native-use-database";`


### Example Useage

#### Creating the database

Next, simply use the hook as so.

`const Database = useDatabase<IMyCustomInterface>('my_somethings');`


#### Listing and finding items

All items exist as an in-memory array that you can access simply by interacting with `Database.items` like so:

```
  const someItem = Database.items.find(item => item.firstName === "Snuffy")
```

#### Inserting items

You can insert an item simply by calling `Database.insert(someItem)`. If your item does not have an `id` property, then the `insert()` function will generate a UUID string for you and return it:

```
  const itemId: string = await Database.insert(someItem);
```

#### Updating items

To update an item, simply call `await Database.update(someItem)`. The database will find an item in the database that has the same `id` as the one you passed to the `update()` function and will overwrite it with the one you passed.

#### Removing items

Removing an item is as easy as passing the ID of the item you wish to remove: `await Database.remove(someItemId)`.

#### Replacing the entire collection

If you're refreshing the database with a list you got from somewhere else, or if you're re-ordering the list, then you can overwrite the entire database by calling `await Database.overwrite(myNewArrayOfItems)`.

### Note

Don't let the database get too big. Neither `state` nor `AsyncStorage` is a good way to manage a large list, or a list of large objects. For everyday useage, though, you shouldn't have any problems.
