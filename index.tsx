import IItem from "./IItem";
import AsyncStorage from "@react-native-community/async-storage";
import * as uuid from "uuid";
import { useEffect, useState } from "react";

/**
 * @description Uses AsyncStorage to create a "database". This database should be read into memory on every load in order to do somplex things like filtering and sorting.
 * @param {string} name The name of the database to create or "connect" to
 */
export default function useDatabase<T>(name: string) {
  const [items, setItems] = useState<Array<T>>([]);

  // return the collection and create it if it doesnt exist
  const initialize = async () => {
    var result: Array<T> = [];
    var _result = await AsyncStorage.getItem(name);
    if (_result !== null) {
      result = JSON.parse(_result);
    } else {
      await AsyncStorage.setItem(name, JSON.stringify([]));
    }

    setItems(result);
  };

  // ensure that the database gets initialized
  useEffect(() => {
    initialize();
  }, [name]);

  /**
   * @description Inserts an item into the database and generates an ID for it if one wasn't already provided.
   * @param item The IItem to insert
   * @returns The ID of the item
   */
  const insert = async (item: T): Promise<string> => {
    var _item = item as IItem;
    // generate an ID if we need to
    if (!_item.id) _item.id = uuid.v4();
    const next = items;
    next.push(_item as T);
    setItems(next);
    await AsyncStorage.setItem(name, JSON.stringify(next), e =>
      console.log("err", e)
    );

    return _item.id;
  };

  /**
   * @description Removes an item from the database using its string ID
   * @param {string} id The ID of the item to remove
   */
  const remove = async (id: string): Promise<void> => {
    var i = items.findIndex(itm => (itm as IItem).id == id);
    const next = items;
    next.splice(i, 1);
    setItems(next);

    await AsyncStorage.setItem(name, JSON.stringify(next));
  };

  /**
   * @description Replaces an item in the database that has the same ID as the one you're passing
   * @param {T} item The item that will replace the one currently in the database with the same ID
   */
  const update = async (item: T): Promise<void> => {
    var _item = item as IItem;
    var i = items.findIndex(itm => (itm as IItem).id == _item.id);
    const next = items;
    next[i] = item;
    setItems(next);

    await AsyncStorage.setItem(name, JSON.stringify(next));
  };

  /**
   * @description Lists all items in the database
   */
  const list = async (): Promise<Array<T>> => {
    return items;
  };

  /**
   * @description Empties the database by replacing it with an empty array.
   */
  const clear = async () => {
    setItems([]);
    await AsyncStorage.clear();
  };

  /**
   * @description Replaces the entire database with the array you pass. This can be used for initialization on load, or re-rdering the array.
   * @param {Array<T>} next The list of items to populate the database with
   */
  const overwrite = async (next: Array<T>) => {
    clear();
    setItems(next);
    await AsyncStorage.setItem(name, JSON.stringify(next));
  };

  return { items, insert, update, remove, list, overwrite };
}
