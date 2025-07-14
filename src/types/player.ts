export interface Category {
    id: number;
    name: string;
    playerCategories?: PlayerCategory[];
    categoryPoints?: PlayerCategoryPoints[];
}

export interface Match {
    id: number;
    date: Date;
    playerMatches?: PlayerMatch[];
}

export interface Player {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    createdAt: Date;
    updatedAt: Date;
    playerMatches: PlayerMatch[];
    playerCategories: PlayerCategory[];
    categoryPoints: PlayerCategoryPoints[];
}

export interface PlayerMatch {
    playerId: number;
    matchId: number;
    player?: Player;
    match: Match;
}

export interface PlayerCategory {
    playerId: number;
    categoryId: number;
    player?: Player;
    category: Category;
}

export interface PlayerCategoryPoints {
    id: number;
    playerId: number;
    categoryId: number;
    points: number;
    player?: Player;
    category?: Category;
}
