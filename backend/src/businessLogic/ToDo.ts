import {createTodo} from "../models/createTodo";
import {parseUserId} from "../auth/utils";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {updateTodo} from "../models/updateTodo";
import {todoDataAccess} from "../dataLayer/todoData";
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')
const todoData = new todoDataAccess();

export async function getAllToDo(jwtToken: string): Promise<createTodo[]> {
    logger.info(`Retrieving all todos`);
    const userId = parseUserId(jwtToken);
    return todoData.getAllToDo(userId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<createTodo> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    logger.info(`Creating todo`);
    return todoData.createToDos({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<updateTodo> {
    const userId = parseUserId(jwtToken);
    logger.info(`Updating todo`);
    return todoData.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    logger.info(`Deleting todo`);
    return todoData.deleteToDo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    logger.info(`Generating todo url`);
    return todoData.generateUploadUrl(todoId);
}