import { userFlags as UserFlags } from "trender-client";
import { premium_type } from "trender-client/Managers/Interfaces/Global";
import UserPermissions from "trender-client/Permissions/UserPermissions";

class premiumAdvantagesClass {
    
    private type: premium_type | 4;

    constructor(type: premium_type, flags: number) {
        const perms = new UserPermissions(flags);
        if(perms.has(UserFlags.TRENDER_EMPLOYEE)) this.type = 4;
        else if(perms.has(UserFlags.TRENDER_PARTNER)) this.type = 3
        else if(perms.has(UserFlags.PREMIUM_USER)) this.type = 1
        else if(perms.has(UserFlags.PREMIUM_2_USER)) this.type = 2
        else if(perms.has(UserFlags.PREMIUM_3_USER)) this.type = 3
        else this.type = type;
    }

    textLength() {
        if(this.type === 1) return 1024;
        if(this.type === 2) return 2048;
        if(this.type === 3) return 4096;
        if(this.type === 4) return 5000;
        return 512;
    }

    fileSize() {
        if(this.type === 1) return 50;
        if(this.type === 2) return 150;
        if(this.type === 3) return 512;
        if(this.type === 4) return 1000;
        return 25;
    }

    animatedProfileFilesAllowed() {
        if(this.type === 1) return true;
        if(this.type === 2) return true;
        if(this.type === 3) return true;
        if(this.type === 4) return true;
        return false;
    }

    nftProfileFilesAllowed() {
        if(this.type === 1) return true;
        if(this.type === 2) return true;
        if(this.type === 3) return true;
        if(this.type === 4) return true;
        return false;
    }
    
    showPostViews() {
        if(this.type === 1) return true;
        if(this.type === 2) return true;
        if(this.type === 3) return true;
        if(this.type === 4) return true;
        return true;
    }

    withdrawCommissions() {
        return 0;
    }

    userProfileSubcriptionCommissions() {
        return false;
    }

    advancedStatistics() {
        if(this.type === 1) return false;
        if(this.type === 2) return false;
        if(this.type === 3) return true;
        if(this.type === 4) return true;
        return false;
    }

    copyrightProtection() {
        if(this.type === 1) return false;
        if(this.type === 2) return false;
        if(this.type === 3) return true;
        if(this.type === 4) return true;
        return false;
    }
}

export const premiumAdvantages = (premium_type: premium_type, flags: number) => new premiumAdvantagesClass(premium_type, flags);