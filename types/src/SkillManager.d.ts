export = SkillManager;
/**
 * Keeps track of registered skills
 */
declare class SkillManager {
    skills: Map<unknown, unknown>;
    /**
     * @param {string} skill Skill name
     * @return {Skill|undefined}
     */
    get(skill: string): Skill | undefined;
    /**
     * @param {Skill} skill
     */
    add(skill: Skill): void;
    /**
     * @param {Skill} skill
     */
    remove(skill: Skill): void;
    /**
     * Find executable skills
     * @param {string}  search
     * @param {boolean} includePassive
     * @return {Skill}
     */
    find(search: string, includePassive?: boolean): Skill;
}
