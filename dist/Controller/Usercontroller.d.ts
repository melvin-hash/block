import { Request, Response } from "express";
export declare const CreateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const LoginUser: (req: Request, res: Response) => Promise<Response>;
export declare const GetAvailableBalance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const GetCurrentPlan: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const UpdateInvestmentPlan: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const UpdateAvailableBalance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const SubtractAvailableBalance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=Usercontroller.d.ts.map