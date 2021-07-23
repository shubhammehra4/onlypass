import { prompt } from "inquirer";
import {
    generatePasswordPrompt,
    listPasswordsPrompt,
    savePasswordPrompt,
    startPrompt,
} from "./prompt";
import { Password } from "../index";

export async function optionsPrompt(master: string, pass: Password[]) {
    var passwords = pass;
    startPrompt();
    const { options } = await prompt([
        {
            type: "list",
            name: "options",
            message: "Menu",
            choices: [
                { name: "List Passwords", value: "list" },
                { name: "Generate Password", value: "generate" },
                { name: "Save Password", value: "save" },
                { name: "Search Password", value: "search" },
                { name: "Update Password", value: "update" },
                { name: "Remove Password", value: "remove" },
                { name: "Update Master Password", value: "master" },
                { name: "Exit", value: "exit" },
            ],
        },
    ]);

    switch (options as string) {
        case "list":
            await listPasswordsPrompt(passwords);
            break;
        case "generate":
            return await generatePasswordPrompt(master, passwords);

        case "save":
            return await savePasswordPrompt(master, passwords);

        case "search":
            break;
        case "update":
            break;
        case "remove":
            break;
        case "master":
            break;
        case "exit":
            process.exit(0);
        default:
            return passwords;
    }

    return passwords;
}
