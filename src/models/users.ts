interface SkillArea {
    skill: string;
    proficiency: string;
}

export class User {
    username: string;
    skillareas: SkillArea[];

    constructor(username: string, skillareas: SkillArea | SkillArea[]) {
        this.username = username;
        this.skillareas = Array.isArray(skillareas) ? [...skillareas] : [skillareas];
    }
}

