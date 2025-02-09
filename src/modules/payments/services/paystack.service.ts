import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { Paystack } from 'paystack-sdk';
import { ValidateCustomer } from 'paystack-sdk/dist/customer/interface';
import { DedicatedAccountCreatedResponse } from 'paystack-sdk/dist/dedicated/interface';
import { CreateRecipient } from 'paystack-sdk/dist/recipient/interface';
import { InitiateTransfer, TransferInitiated } from 'paystack-sdk/dist/transfer/interface';
import { TransferData } from '../interfaces/transfer.interface';
import { ChargeAuthorization, InitializeTransaction } from 'paystack-sdk/dist/transaction/interface';


@Injectable()
export class PaystackService {
    paystack: Paystack;
    preferredBank: string;
    private paystackSecret: string;

    constructor(configService: ConfigService) {
        this.paystackSecret = configService.get('paystack.secret');
        this.paystack = new Paystack(configService.get('paystack.secret'));
        this.preferredBank = configService.get('paystack.prefferedBank');
    }

    async validateWebhookEvent(requestBody: Record<string, any>, signature: string) {
        const hash = crypto.createHmac('sha512', this.paystackSecret).update(JSON.stringify(requestBody)).digest('hex');
        if (hash !== signature) throw new UnauthorizedException();

        return true;
    }

    async getBankList() {
        try {
            const url = "https://api.paystack.co/bank";
            const result = await axios.get(url, { headers: { Authorization: 'Bearer ' + this.paystackSecret } });

            return result.data?.status === true ? result.data?.data : false;
        } catch (error) {
            console.log(error?.message);
            return false;
        }
    }

    async resolveBankAccount({ account_number, bank_code }: { account_number: string, bank_code: string }) {
        const result = await this.paystack.verification.resolveAccount({ account_number, bank_code })
        if (!result.status) return false;

        return result.data;
    }

    async createCustomer(params: {
        first_name: string,
        last_name: string,
        email: string,
        phone?: string
    }) {
        const { data, status } = await this.paystack.customer.create(params);
        if (!status) return false;

        return data;
    }

    async createRecipient(params: CreateRecipient) {
        const { data, status } = await this.paystack.recipient.create(params);
        if (!status) return false;

        return data;
    }

    async createDedicatedAccount(customerCode: string) {
        const response = await this.paystack.dedicated.create({
            customer: customerCode,
            preferred_bank: this.preferredBank
        });

        console.log('createDedicatedAccount response',response);
        if (!response.status) return false;

        return (response as DedicatedAccountCreatedResponse).data;
    }

    async validatePaystackCustomer(customerCode: string, data: ValidateCustomer) {
        const response = await this.paystack.customer.validate(customerCode, data);
        if (response.status) {
            return true
        } else {
            console.log('validatePaystackCustomer ->', response)
            return null
        }
    }

    async initiateTransfer(data: InitiateTransfer): Promise<false | TransferData> {
        const response = await this.paystack.transfer.initiate(data);
        if (!response.status) return false;

        return (response as TransferInitiated).data as TransferData;
    }

    async initiateTransaction(params: InitializeTransaction) {
        const { data, status } = await this.paystack.transaction.initialize(params);
        if (!status) return false;

        return data;
    }

    async chargeCardAuthorization(params: ChargeAuthorization) {
        const { data, status } = await this.paystack.transaction.chargeAuthorization(params);
        if (!status) return false;

        return data;
    }
}
