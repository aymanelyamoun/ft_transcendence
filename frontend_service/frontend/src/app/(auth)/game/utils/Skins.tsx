export interface SkinInterface {
    width: number;
    height: number;
    path : string;
}

export const defaultBall : SkinInterface = {
    width: 60,
    height: 60,
    path: '/GameAssets/defaultBall.png',
};

export const redBall : SkinInterface = {
    width: 60,
    height: 60,
    path: '/GameAssets/redBall.png',
};

export const basketBall : SkinInterface = {
    width: 60,
    height: 60,
    path: '/GameAssets/basketBall.png',
};

export const footBall : SkinInterface = {
    width: 60,
    height: 60,
    path: '/GameAssets/footBall.png',
};

export const beachTable : SkinInterface = {
    width: 1920,
    height: 1024,
    path: '/GameAssets/beachTable.png',
};

export const defaultTable : SkinInterface = {
    width: 1920,
    height: 1024,
    path: '/GameAssets/defaultTable.png',
};

export const redTable : SkinInterface = {
    width: 1920,
    height: 1024,
    path: '/GameAssets/redTable.png',
};

export const redPaddle : SkinInterface = {
    width: 20,
    height: 183,
    path: '/GameAssets/redPaddle.png',
};

export const greenPaddle : SkinInterface = {
    width: 20,
    height: 183,
    path: '/GameAssets/greenPaddle.png',
};

export const bluePaddle : SkinInterface = {
    width: 20,
    height: 183,
    path: '/GameAssets/bluePaddle.png',
};

export const defaultPaddle : SkinInterface = {
    width: 20,
    height: 183,
    path: '/GameAssets/defaultPaddle.png',
};

export const getBallSkin = (skin : string) => {
    switch (skin) {
        case 'redball':
            return redBall;
        case 'basketball':
            return basketBall;
        case 'mikaza':
            return footBall;
        default:
            return defaultBall;
    }
};

export const getPaddleSkin = (skin : string) => {
    switch (skin) {
        case 'bong':
            return redPaddle;
        case 'greeny':
            return greenPaddle;
        case 'potto':
            return bluePaddle;
        default:
            return defaultPaddle;
    }
};

export const getTableSkin = (skin : string) => {
    switch (skin) {
        case 'kazino':
            return redTable;
        case 'beach':
            return beachTable;
        default:
            return defaultTable;
    }
};