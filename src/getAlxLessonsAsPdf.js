import url from 'url';
import { createRunner } from '@puppeteer/replay';

export async function run(extension) {
    const runner = await createRunner(extension);

    await runner.runBeforeAllSteps();

    await runner.runStep({
        type: 'setViewport',
        width: 811,
        height: 615,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
    });
    await runner.runStep({
        type: 'navigate',
        url: 'https://intranet.alxswe.com/auth/sign_in',
        assertedEvents: [
            {
                type: 'navigation',
                url: 'https://intranet.alxswe.com/auth/sign_in',
                title: 'Sessions - new | Intranet'
            }
        ]
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#user_email'
            ]
        ],
        offsetY: 8,
        offsetX: 141,
    });
    await runner.runStep({
        type: 'change',
        value: 'adil8majhoul@gmail.com',
        selectors: [
            [
                '#user_email'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'change',
        value: 'alxskhon1-',
        selectors: [
            [
                '#user_password'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#user_remember_me'
            ]
        ],
        offsetY: 10,
        offsetX: 5.15625,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'div.actions > input'
            ]
        ],
        offsetY: 11,
        offsetX: 24.375,
        assertedEvents: [
            {
                type: 'navigation',
                url: 'https://intranet.alxswe.com/',
                title: ''
            }
        ]
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'div.student-home > div > div:nth-of-type(2) > div:nth-of-type(1) > div i'
            ]
        ],
        offsetY: 12.359375,
        offsetX: 10.75,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#period_scores_modal_17 tr:nth-of-type(2) a'
            ]
        ],
        offsetY: 9.296875,
        offsetX: 50,
        assertedEvents: [
            {
                type: 'navigation',
                url: 'https://intranet.alxswe.com/projects/1225',
                title: ''
            }
        ]
    });

    await runner.runAfterAllSteps();
}

if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
    run()
}
