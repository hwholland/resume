Proj4js.Proj.stere={ssfn_:function(p,s,e){s*=e;return(Math.tan(.5*(Proj4js.common.HALF_PI+p))*Math.pow((1.-s)/(1.+s),.5*e));},TOL:1.e-8,NITER:8,CONV:1.e-10,S_POLE:0,N_POLE:1,OBLIQ:2,EQUIT:3,init:function(){this.phits=this.lat_ts?this.lat_ts:Proj4js.common.HALF_PI;var t=Math.abs(this.lat0);if((Math.abs(t)-Proj4js.common.HALF_PI)<Proj4js.common.EPSLN){this.mode=this.lat0<0.?this.S_POLE:this.N_POLE;}else{this.mode=t>Proj4js.common.EPSLN?this.OBLIQ:this.EQUIT;}this.phits=Math.abs(this.phits);if(this.es){var X;switch(this.mode){case this.N_POLE:case this.S_POLE:if(Math.abs(this.phits-Proj4js.common.HALF_PI)<Proj4js.common.EPSLN){this.akm1=2.*this.k0/Math.sqrt(Math.pow(1+this.e,1+this.e)*Math.pow(1-this.e,1-this.e));}else{t=Math.sin(this.phits);this.akm1=Math.cos(this.phits)/Proj4js.common.tsfnz(this.e,this.phits,t);t*=this.e;this.akm1/=Math.sqrt(1.-t*t);}break;case this.EQUIT:this.akm1=2.*this.k0;break;case this.OBLIQ:t=Math.sin(this.lat0);X=2.*Math.atan(this.ssfn_(this.lat0,t,this.e))-Proj4js.common.HALF_PI;t*=this.e;this.akm1=2.*this.k0*Math.cos(this.lat0)/Math.sqrt(1.-t*t);this.sinX1=Math.sin(X);this.cosX1=Math.cos(X);break;}}else{switch(this.mode){case this.OBLIQ:this.sinph0=Math.sin(this.lat0);this.cosph0=Math.cos(this.lat0);case this.EQUIT:this.akm1=2.*this.k0;break;case this.S_POLE:case this.N_POLE:this.akm1=Math.abs(this.phits-Proj4js.common.HALF_PI)>=Proj4js.common.EPSLN?Math.cos(this.phits)/Math.tan(Proj4js.common.FORTPI-.5*this.phits):2.*this.k0;break;}}},forward:function(p){var l=p.x;l=Proj4js.common.adjust_lon(l-this.long0);var a=p.y;var x,y;if(this.sphere){var s,c,b,d;s=Math.sin(a);c=Math.cos(a);b=Math.cos(l);d=Math.sin(l);switch(this.mode){case this.EQUIT:y=1.+c*b;if(y<=Proj4js.common.EPSLN){Proj4js.reportError("stere:forward:Equit");}y=this.akm1/y;x=y*c*d;y*=s;break;case this.OBLIQ:y=1.+this.sinph0*s+this.cosph0*c*b;if(y<=Proj4js.common.EPSLN){Proj4js.reportError("stere:forward:Obliq");}y=this.akm1/y;x=y*c*d;y*=this.cosph0*s-this.sinph0*c*b;break;case this.N_POLE:b=-b;a=-a;case this.S_POLE:if(Math.abs(a-Proj4js.common.HALF_PI)<this.TOL){Proj4js.reportError("stere:forward:S_POLE");}y=this.akm1*Math.tan(Proj4js.common.FORTPI+.5*a);x=d*y;y*=b;break;}}else{b=Math.cos(l);d=Math.sin(l);s=Math.sin(a);var e,f;if(this.mode==this.OBLIQ||this.mode==this.EQUIT){var X=2.*Math.atan(this.ssfn_(a,s,this.e));e=Math.sin(X-Proj4js.common.HALF_PI);f=Math.cos(X);}switch(this.mode){case this.OBLIQ:var A=this.akm1/(this.cosX1*(1.+this.sinX1*e+this.cosX1*f*b));y=A*(this.cosX1*e-this.sinX1*f*b);x=A*f;break;case this.EQUIT:var A=2.*this.akm1/(1.+f*b);y=A*e;x=A*f;break;case this.S_POLE:a=-a;b=-b;s=-s;case this.N_POLE:x=this.akm1*Proj4js.common.tsfnz(this.e,a,s);y=-x*b;break;}x=x*d;}p.x=x*this.a+this.x0;p.y=y*this.a+this.y0;return p;},inverse:function(p){var x=(p.x-this.x0)/this.a;var y=(p.y-this.y0)/this.a;var l,a;var b,s,t=0.0,d=0.0,r,h=0.0,e=0.0;var i;if(this.sphere){var c,f,g,j;f=Math.sqrt(x*x+y*y);c=2.*Math.atan(f/this.akm1);g=Math.sin(c);j=Math.cos(c);l=0.;switch(this.mode){case this.EQUIT:if(Math.abs(f)<=Proj4js.common.EPSLN){a=0.;}else{a=Math.asin(y*g/f);}if(j!=0.||x!=0.)l=Math.atan2(x*g,j*f);break;case this.OBLIQ:if(Math.abs(f)<=Proj4js.common.EPSLN){a=this.phi0;}else{a=Math.asin(j*this.sinph0+y*g*this.cosph0/f);}c=j-this.sinph0*Math.sin(a);if(c!=0.||x!=0.){l=Math.atan2(x*g*this.cosph0,c*f);}break;case this.N_POLE:y=-y;case this.S_POLE:if(Math.abs(f)<=Proj4js.common.EPSLN){a=this.phi0;}else{a=Math.asin(this.mode==this.S_POLE?-j:j);}l=(x==0.&&y==0.)?0.:Math.atan2(x,y);break;}p.x=Proj4js.common.adjust_lon(l+this.long0);p.y=a;}else{r=Math.sqrt(x*x+y*y);switch(this.mode){case this.OBLIQ:case this.EQUIT:t=2.*Math.atan2(r*this.cosX1,this.akm1);b=Math.cos(t);s=Math.sin(t);if(r==0.0){d=Math.asin(b*this.sinX1);}else{d=Math.asin(b*this.sinX1+(y*s*this.cosX1/r));}t=Math.tan(.5*(Proj4js.common.HALF_PI+d));x*=s;y=r*this.cosX1*b-y*this.sinX1*s;e=Proj4js.common.HALF_PI;h=.5*this.e;break;case this.N_POLE:y=-y;case this.S_POLE:t=-r/this.akm1;d=Proj4js.common.HALF_PI-2.*Math.atan(t);e=-Proj4js.common.HALF_PI;h=-.5*this.e;break;}for(i=this.NITER;i--;d=a){s=this.e*Math.sin(d);a=2.*Math.atan(t*Math.pow((1.+s)/(1.-s),h))-e;if(Math.abs(d-a)<this.CONV){if(this.mode==this.S_POLE)a=-a;l=(x==0.&&y==0.)?0.:Math.atan2(x,y);p.x=Proj4js.common.adjust_lon(l+this.long0);p.y=a;return p;}}}}};