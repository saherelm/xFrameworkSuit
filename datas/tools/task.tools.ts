export const taskIdStartKey = '_[';
export const taskIdEndKey = ']';

/**
 * check if task name contains id  ...
 *
 * @param key the task name ...
 */
export function hasTaskId(key: string | any) {
  //
  if (!key) {
    return false;
  }

  //
  const mKey = key.toString() as string;
  return mKey.includes(taskIdStartKey) && mKey.includes(taskIdEndKey);
}

/**
 * retrieve and extract the raw task name from a task name ...
 *
 * @param key the task name ...
 */
export function getTaskName(key: string | any) {
  //
  if (!key) {
    return '';
  }

  //
  const mKey = key.toString() as string;

  //
  if (!hasTaskId(mKey)) {
    return mKey;
  }

  //
  const taskId = getTaskId(mKey);
  const taskIdString = `${taskIdStartKey}${taskId}${taskIdEndKey}`;
  const result = mKey.replace(taskIdString, '');

  //
  return result;
}

/**
 * retrieve and extract the id inside a task name ...
 *
 * @param key the task name ...
 */
export function getTaskId(key: string | any) {
  //
  // Validate Args ...
  if (!key || !hasTaskId(key)) {
    return '';
  }

  //
  // Task Id ...
  let result = key.toString() as string;

  //
  // Validating Info ...
  let index = result.indexOf(taskIdStartKey);

  //
  result = result.substr(index, result.length);
  result = result.replace(taskIdStartKey, '');

  //
  index = result.indexOf(taskIdEndKey);
  result = result.substring(0, index);

  //
  // Return Result ...
  return result;
}

/**
 * prepare a Task With ID and return ...
 *
 * @param key the Task Name ...
 * @param id th ID ...
 */
export function setTaskId(key: string | any, id: string | any) {
  return `${key.toString()}${taskIdStartKey}${id.toString()}${taskIdEndKey}`;
}
