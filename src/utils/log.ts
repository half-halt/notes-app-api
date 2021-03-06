import chalk from 'chalk';
import { format } from 'util';
import process from 'process';

export enum LEVEL
{
	ERROR,
	WARNING,
	VERBOSE,
	DEBUG
}

const LEVEL_NAME = [
	chalk.bgRedBright(chalk.whiteBright('[ E ]')),
	chalk.bgYellow(chalk.whiteBright('[ W ]')),
	chalk.green('[ I ]'),
	chalk.blueBright('[ D ]')
];

// Determine the initial level
var currentLevel = (process.env.NODE_ENV === 'production') ? 
	((process.env.DEBUG_API === 'on') ? LEVEL.DEBUG : LEVEL.VERBOSE) :
	LEVEL.DEBUG;
console.log('CurrentLevel:', currentLevel);

function writeLog(logLevel: LEVEL, component: string|null,  message: string, ...args: any[])
{
	if (logLevel <= currentLevel)
	{
		const logMessage = format(message, ...args);		
		if ((typeof(component) === 'string') && (component.length != 0))
			console.log(`${LEVEL_NAME[logLevel]} :: ${chalk.cyanBright(component.toUpperCase())}: ${logMessage}`);
		else
			console.log(`${LEVEL_NAME[logLevel]} :: ${logMessage}`);
	}
}

function createComponentLog(component: string, componentLevel?: LEVEL)
{
	const componentWrite = (level: LEVEL, message: string, ...args: any[]) => {
		const check = componentLevel || currentLevel;
		if (level <= check)
			writeLog(level, component, message, ...args);
	}

	return {
		debug: componentWrite.bind(null, LEVEL.DEBUG),
		info: componentWrite.bind(null, LEVEL.VERBOSE),
		warning: componentWrite.bind(null, LEVEL.WARNING),
		error: componentWrite.bind(null, LEVEL.ERROR),
	}
}

interface Logger
{
	debug(message: string, ...args: any[]): void;
	info(message: string, ... args: any[]): void;
	warning(message: string, ...args: any[]): void;
	error(message: string, ...args: any[]): void;
}

interface RootLogger extends Logger
{
	create(componentName: string, level?: LEVEL): Logger;
}

const log: RootLogger = {
	debug: writeLog.bind(null, LEVEL.DEBUG, null),
	info: writeLog.bind(null, LEVEL.VERBOSE, null),
	warning: writeLog.bind(null, LEVEL.WARNING, null),
	error: writeLog.bind(null, LEVEL.ERROR, null),
	create: (componetName: string, level?: LEVEL) => createComponentLog(componetName, level)
};

export { log, log as default };
export const setLevel = (level: LEVEL) => { currentLevel = level };
export const getLevel = () => currentLevel;
