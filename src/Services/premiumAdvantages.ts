import type { GlobalInterface } from "trender-client";

class premiumAdvantagesClass {
    
    private type: GlobalInterface.premium_type;

    constructor(type: GlobalInterface.premium_type) {
        this.type = type;
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
        if(this.type === 0) return false;
        if(this.type === 1) return true;
        if(this.type === 2) return true;
        if(this.type === 3) return true;
        return false;
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

export const premiumAdvantages = (type: GlobalInterface.premium_type) => new premiumAdvantagesClass(type);