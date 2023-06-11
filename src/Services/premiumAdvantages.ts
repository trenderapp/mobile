import { userFlags } from "trender-client";
import { premium_type } from "trender-client/Managers/Interfaces/Global";
import UserPermissions from "trender-client/Permissions/UserPermissions";

class premiumAdvantagesClass {
    
    private type: premium_type;

    constructor(type: premium_type, flags: number) {
        const perms = new UserPermissions(flags);
        if(perms.has(userFlags.PREMIUM_USER)) this.type = 1
        if(perms.has(userFlags.TRENDER_PARTNER) || perms.has(userFlags.PREMIUM_2_USER)) this.type = 2
        if(perms.has(userFlags.TRENDER_EMPLOYEE) || perms.has(userFlags.PREMIUM_3_USER)) this.type = 3
        else this.type = type;
    }

    textLength() {
        if(this.type === 0) return 512;
        if(this.type === 1) return 1024;
        if(this.type === 2) return 2048;
        if(this.type === 3) return 4096;
        return 512;
    }

    fileSize() {
        if(this.type === 0) return 25;
        if(this.type === 1) return 50;
        if(this.type === 2) return 100;
        if(this.type === 3) return 200;
        return 25;
    }


    animatedProfileFilesAllowed() {
        if(this.type === 0) return false;
        if(this.type === 1) return true;
        if(this.type === 2) return true;
        if(this.type === 3) return true;
        return false;
    }

    nftProfileFilesAllowed() {
        if(this.type === 0) return false;
        if(this.type === 1) return true;
        if(this.type === 2) return true;
        if(this.type === 3) return true;
        return false;
    }
    
    showPostViews() {
        if(this.type === 0) return true;
        if(this.type === 1) return true;
        if(this.type === 2) return true;
        if(this.type === 3) return true;
        return true;
    }

    withdrawCommissions() {
        if(this.type === 0) return true;
        if(this.type === 1) return true;
        if(this.type === 2) return false;
        if(this.type === 3) return false;
        return true;
    }

    userProfileSubcriptionCommissions() {
        if(this.type === 0) return true;
        if(this.type === 1) return true;
        if(this.type === 2) return true;
        if(this.type === 3) return false;
        return true;
    }

    advancedStatistics() {
        if(this.type === 0) return false;
        if(this.type === 1) return false;
        if(this.type === 2) return false;
        if(this.type === 3) return true;
        return false;
    }

    copyrightProtection() {
        if(this.type === 0) return false;
        if(this.type === 1) return false;
        if(this.type === 2) return false;
        if(this.type === 3) return true;
        return false;
    }
}

export const premiumAdvantages = (type: premium_type, flags: number) => new premiumAdvantagesClass(type, flags);