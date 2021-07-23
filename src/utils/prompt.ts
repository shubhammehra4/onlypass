import chalk from "chalk";
import { textSync } from "figlet";
import { prompt } from "inquirer";
import storage from "node-persist";
import { Password } from "../index";
import { encrypt, sleep } from "./helpers";
import { generatePassword } from "./password";

const log = console.log;
export function startPrompt() {
    console.clear();
    log(
        textSync("ONLYPASS", {
            font: "Ghost",
            horizontalLayout: "controlled smushing",
            verticalLayout: "controlled smushing",
            width: 100,
            whitespaceBreak: true,
        })
    );
    log("\n");
    log(chalk.whiteBright.bgRed.bold("A Simple CLI Password Manager"));
}

export function newUserPrompt() {
    log("\n");
    log(chalk.green.bold("Welcome to OnlyPass\n"));
    log(
        chalk.bold(
            "The Simple Password Manager that makes your online presence safe and secure.\n"
        )
    );
    log("Start by creating a Master Password\n");
    log(
        chalk.grey.bold.underline(
            "**If you loose the master password all your passwords will be lost.\n"
        )
    );
    log(chalk.grey.bold.underline("**Do not edit the master.txt created."));
    log("\n");
}

export async function listPasswordsPrompt(passwords: Password[]) {
    passwords.forEach((p) => {
        log(`${p.id} ${p.field} ${p.username} **********`);
    });
    console.table(passwords);
    await sleep(10000);
}

export async function generatePasswordPrompt(
    master: string,
    passwords: Password[]
) {
    const { field, username } = await prompt([
        {
            type: "input",
            name: "field",
            message: "Website/Field",
            default: "global",
        },
        {
            type: "input",
            name: "username",
            message: "Username",
            default: "admin",
        },
    ]);

    let password = generatePassword();
    let encryptedPassword = encrypt(password, master);

    await storage.setItem(
        field,
        JSON.stringify({ field, username, password: encryptedPassword })
    );
    await sleep(3000);
    return passwords.concat({
        id: passwords.length,
        field,
        username,
        password,
    });
}

export async function savePasswordPrompt(
    master: string,
    passwords: Password[]
) {
    const { field, username, password } = await prompt([
        {
            type: "input",
            name: "field",
            message: "Website/Field",
            default: "global",
        },
        {
            type: "input",
            name: "username",
            message: "Username",
            default: "admin",
        },
        {
            type: "password",
            name: "password",
            message: "Password",
        },
    ]);

    await storage.setItem(
        field,
        JSON.stringify({ field, username, password: encrypt(password, master) })
    );
    await sleep(3000);
    return passwords.concat({
        id: passwords.length,
        field,
        username,
        password,
    });
}

// export async function searchPasswordPrompt(master: string) {}
